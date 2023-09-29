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
 * @typedef {{min: number, max?: number}} ConcentricRadii
 * @typedef {Record<string, ConcentricRadii>} Distances
 * @typedef {{x: number, y: number, radius: ConcentricRadii, turns: string}} Move
 */

/** @type {Distances} */
const radii = {
  'You are alone': { min: 70, max: undefined },
  'You can hear': { min: 40, max: 70 },
  'You think you can see': { min: 25, max: 40 },
  'You catch a glimpse': { min: 7, max: 25 },
};

/** @returns {Move | null} */
function parseText() {
  const megaContent = document.getElementById('megaContent');
  if (!megaContent) return null;

  const textNodes = Array.from(megaContent.children[0].childNodes)
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

  // How many turns have we used?
  const turnsMatch = turnsLine.match(/You have used (\d+) \/ 15/);
  if (!turnsMatch) return null;
  const turns = turnsMatch[1];

  return { x, y, radius: radii[key], turns };
}

/**
 * Draw a canvas that overlays the map. Include guidelines s.t. if we click near a corner, and get
 * "You are alone" (> 70 px), we make sure we eliminate the entire corner (instead of leaving the
 * veeeeery edge of the corner as a possibility). If the radius (distance to the corner) is 70 px,
 * then the side of the circle is 70 / sqrt(2) ~= 49.5 px.
 *
 * @param {HTMLElement} map
 * @returns {HTMLCanvasElement}
 */
function drawCanvas(map) {
  const canvas = document.createElement('canvas');

  const [padding, width, height] = [5, 250, 200];
  const diagonal = Math.floor(70 / Math.SQRT2); // 49

  canvas.width = width + 2 * padding;
  canvas.height = height + 2 * padding;

  canvas.style.position = 'relative';
  canvas.style.display = 'block';
  canvas.style.top = `-${canvas.height + padding}px`;
  canvas.style.zIndex = '100';
  canvas.style.pointerEvents = 'none';

  // Find the map & append the canvas "after" (on top, really)
  map.parentNode.appendChild(canvas);

  // Draw guidelines for where to click s.t. we exclude a corner
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.setLineDash([5, 3]);
  ctx.beginPath();
  ctx.rect(
    5 + diagonal,
    5 + diagonal,
    canvas.width - 2 * (diagonal + padding),
    canvas.height - 2 * (diagonal + padding),
  );
  ctx.stroke();
  ctx.closePath();

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

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

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

/** @param {any} x */
function setAndReturn(x) {
  window.localStorage.setItem('moves', JSON.stringify(x));
  return x;
}

/** @param {Move} move  */
function updateMoves({ x, y, radius, turns }) {
  const moves = [
    ...(JSON.parse(window.localStorage.getItem('moves')) || []),
    { x, y, radius, turns },
  ];
  return setAndReturn(moves);
}

function main() {
  console.log('Hello from the CFC helper!');
  const map = document.getElementsByName('cf')[0]; // <input ... />

  if (!map) return setAndReturn([]);
  const canvas = drawCanvas(map);

  const parsed = parseText();
  if (!parsed) return setAndReturn([]);

  const moves = updateMoves(parsed);
  moves.forEach((move) => drawCircles(canvas, move));
}
