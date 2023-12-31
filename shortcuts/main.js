// @ts-check

/** Type definitions help when in VSCode
 * @typedef {{back: number, left: number, right: number}} ActionsMap
 * @typedef {Record<string, number>} Keycodes
 */

/** @type {Keycodes} */
const KEYCODES = {
  f: 70,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

/** @type {ActionsMap} */
const arrowActions = {
  back: KEYCODES.up,
  left: KEYCODES.left,
  right: KEYCODES.right,
};

/** @type {ActionsMap} */
const ijkActions = {
  back: KEYCODES.i,
  left: KEYCODES.j,
  right: KEYCODES.l,
};

const URLS = {
  CE_MAIN: 'https://www.clickcritters.com/clickexchange.php',
  FEED: 'https://www.clickcritters.com/feed/',
};

function clickLink(e) {
  // Find the offset of the first link on the page
  // This is 0 on the 'correct answer' page and 1 on the main CE page, which we
  // operationalize by looking at classes (on the main page, the first link is a plain <a>)
  const offset = document.links[0].classList.length ? 0 : 1;

  // 'back' is always the first link
  if ([arrowActions.back, ijkActions.back].includes(e.keyCode)) {
    document.links[0].click();
    return;
  }

  // otherwise, compute offset and click the answer; support left/right and j/k
  ['left', 'right'].forEach((action, index) => {
    if (e.keyCode === arrowActions[action] || e.keyCode === ijkActions[action]) {
      document.links[index + offset].click();
    }
  });

  // Oh, and add the feed page; f clicks the link
  if (e.keyCode === KEYCODES.f) {
    const feedLink = document.querySelector("a[href*='?act=doRareCandy']");
    if (feedLink) feedLink.click();
    return;
  }
}

if (window === top) {
  window.addEventListener('keyup', clickLink, false);
}
