// @ts-check
window.addEventListener('DOMContentLoaded', main);

/**
 * Setup & background
 * ------------------
 * The game has a very predictable structure. Because this will only be around for a few days,
 * we hardcode a lot of it.
 *
 * When starting the game (or refreshing the page), we will see:
 *
 * > Click the image below where you think the critter is hiding!
 *
 * While playing the game, we'll see three lines of text:
 *
 * First (always):
 * > You search the co-ordinates (X, Y)
 *
 * Then one of these ...
 * > You are alone
 * > You can hear the critter moving in the distance
 * > You think you can see a shadow moving nearby
 * > You catch a glimpse of the critter. Is it behind that bush over there?!?
 *
 * Then (always):
 * > You have used # / 15
 *
 * We call these search, clue, and turns respectively.
 *
 * The algorithm
 * -------------
 * We win the game if we click within 7 pixels of the critter.
 *
 * If we don't win, we get a clue that tells us how far away we are.
 *
 * - You catch a glimpse ...: up to 25 pixels away (so between 7 & 25)
 * - You think you can see ...: up to 40 (so between 25 & 40)
 * - You can hear ...: between 40 & 70
 * - You are alone: 70+ pixels away
 *
 * If we draw two circles around where we clicked, then the critter must be within those
 * two circles. (When we have only one circle, we can consider the larger one to be infinite,
 * such that the entire map is fair game.)
 *
 * We shade everything inside the inner circle & outside the outer circle, because we know
 * the critter cannot be there. We accumulate these circles over the course of the game and
 * overlay them to rule out progressively more of the map.
 */

/**
 * Some type definitions to help, I guess.
 *
 * @typedef {Record<string, [number, number?]>} Distances
 *
 * @typedef {{min: number, max?: number}} ConcentricRadii
 * @typedef {{x: number, y: number, radius: ConcentricRadii, turns: string}} Move
 */

/** @type {Distances} */
const radii = {
  'You are alone': [70, undefined],
  'You can hear': [40, 70],
  'You think you can see': [25, 40],
  'You catch a glimpse': [7, 25],
};

/**
 * @returns {Move | null}
 */
function parseText() {
  const textNodes = Array.from(
    document.getElementById('megaContent').children[0].childNodes
  )
    .filter((x) => x.nodeName === '#text')
    .map((x) => x.textContent);
  const [searchLine, clueLine, turnsLine] = textNodes;
  if (!searchLine || !clueLine || !turnsLine) return null;

  // First, parse the coordinates
  const searchCoords = searchLine.match(/co-ordinates \((\d+), (\d+)\)/);
  if (!searchCoords) return null;

  const x = parseInt(searchCoords[1]);
  const y = parseInt(searchCoords[2]);

  // Then read the clue to find out how far we are from the prize
  const key = Object.keys(radii).find((key) => clueLine.includes(key));
  if (!key) return null;
  const [min, max] = radii[key];

  // How many turns have we used?
  const turnsMatch = turnsLine.match(/You have used (\d+) \/ 15/);
  if (!turnsMatch) return null;
  const turns = turnsMatch[1];

  return { x, y, radius: { min, max }, turns };
}

/**
 * @returns {HTMLCanvasElement}
 */
function drawCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 260;
  canvas.height = 210;

  canvas.style.position = 'relative';
  canvas.style.display = 'block';
  canvas.style.top = `-${canvas.height}px`;
  canvas.style.zIndex = '100';
  canvas.style.pointerEvents = 'none';

  // Find the map & append the canvas "after" (on top, really)
  const map = document.getElementsByName('cf')[0]; // <input ... />
  map.parentNode.appendChild(canvas);

  return canvas;
}

/**
 * From a canvas element and a set of coordinates, draw a circle around the coordinates.
 *
 * The distance between you & the critter is at least `radius.min` pixels, and at most
 * `radius.max` pixels (which we may not have).
 *
 * Fill the inner circle with semi-transparent white, which indicates the critter is not there.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {Move} move
 */
function drawCircles(canvas, { x, y, radius }) {
  const padding = 5;

  // The distance between the critter & you is at most `radius` pixels;
  // indicate this with a circle, filled white and semi-transparent
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

  // Draw inner circle & fill; we can exclude this area
  ctx.beginPath();
  ctx.arc(x + padding, y + padding, radius.min, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  if (!radius.max) return;

  // Draw map outline then outer circle, and fill in between; we can exclude that, too
  ctx.beginPath();
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.arc(x + padding, y + padding, radius.max, 0, 2 * Math.PI, true);
  ctx.fill();
  ctx.closePath();
}

function setAndReturn(x) {
  window.localStorage.setItem('moves', JSON.stringify(x));
  return x;
}

function updateMoves({ x, y, radius, turns }) {
  const moves = [
    ...(JSON.parse(window.localStorage.getItem('moves')) || []),
    { x, y, radius, turns },
  ];
  return setAndReturn(moves);
}

function main() {
  console.log('Hello from the CFC helper!');
  const parsed = parseText();
  if (!parsed) return setAndReturn([]);

  const canvas = drawCanvas();
  const moves = updateMoves(parsed);
  moves.forEach((move) => drawCircles(canvas, move));
}
