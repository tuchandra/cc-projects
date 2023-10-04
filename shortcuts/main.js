// Modify as desired; another combination is
// { back: 38, left: 37, right: 39 } for up/left/right arrows
const KEYCODES = {
  back: 73,  // i
  left: 74,  // j
  right: 75,  // k
};
const ALTKEYCODES = {
  back: 38,  // up arrow
  left: 37,  // left arrow
  right: 39,  // right arrow
};
const PAGES = {
  CE_MAIN: "https://www.clickcritters.com/clickexchange.php",
  FEED: "https://www.clickcritters.com/feed/"
}

let leftAnswer, rightAnswer;
let feedLink;
window.onload = () => {
  const width = document.body.clientWidth;
  const xLeft = (width / 2) - 50;
  const xRight = (width / 2) + 50;

  // Check if we're on the main CE page; if so, there's a lot of extra text at the top
  // and we have to account for this when setting the y-coordinate.
  const y = (document.URL === PAGES.CE_MAIN) ? 350 : 150;

  leftAnswer = document.elementFromPoint(xLeft, y);
  rightAnswer = document.elementFromPoint(xRight, y);
  feedLink = document.querySelector("a[href*='?act=doRareCandy']");
}

const clickLink = (e) => {
  if (e.keyCode === KEYCODES.left) {
    leftAnswer.click();
    return;
  }
  if (e.keyCode === KEYCODES.right) {
    rightAnswer.click();
    return;
  }
  if (e.keyCode === KEYCODES.back) {
    document.links[0].click();
    return;
  }

  if (e.keyCode === 70 && document.URL.startsWith(PAGES.FEED)) {
    console.log("beep");
    feedLink.click();
  }
}

if (window === top) {
  window.addEventListener('keyup', clickLink, false);
}