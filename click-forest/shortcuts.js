const KEYCODES = {
  up: 38, // up arrow
  left: 37, // left arrow
  right: 39, // right arrow
  down: 40, // down arrow
};
const PAGES = {
  CE_MAIN: 'https://www.clickcritters.com/clickexchange_gwoc.php',
};

let leftAnswer, rightAnswer;
window.onload = () => {
  const width = document.body.clientWidth;
  const xLeft = width / 2 - 50;
  const xRight = width / 2 + 50;

  // Check if we're on the main CE page; if so, there's a lot of extra text at the top
  // and we have to account for this when setting the y-coordinate.
  const y = document.URL === PAGES.CE_MAIN ? 350 : 150;

  leftAnswer = document.elementFromPoint(xLeft, y);
  rightAnswer = document.elementFromPoint(xRight, y);
};

const clickLink = (e) => {
  const offset = document.links[0].classList.length ? 0 : 1;

  if (e.keyCode === KEYCODES.left) {
    document.links[0 + offset].click();
    return;
  }
  if (e.keyCode === KEYCODES.down) {
    document.links[1 + offset].click();
    return;
  }
  if (e.keyCode === KEYCODES.right) {
    document.links[2 + offset].click();
    return;
  }

  // back is always the first link
  if (e.keyCode === KEYCODES.up) {
    document.links[0].click();
    return;
  }
};

if (window === top) {
  window.addEventListener('keyup', clickLink, false);
}
