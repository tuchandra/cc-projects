const KEYCODES = {
  // numbers
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  // some letters that I happen to use
  // defining all of them would be fine but I used a "just in time" approach (laziness)
  f: 70,
  g: 71,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  p: 80,
  q: 81,
  u: 85,
  w: 87,
  y: 89,
  // arrows
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  // a couple others on a regular qwerty keyboard
  semi: 59,
  apostrophe: 222,
};

const clickLink = (e) => {
  // if the first link is just a plain link, then skip it; this happens on the main CE page
  // otherwise, we're on the "Correct answer" page that shows the question first
  const offset = document.links[0].classList.length ? 0 : 1;

  // the rest of thi scontains all the different shortcuts I used; I never had all of these
  // enabled at once because that would be insane; that said, keeping all of them here is
  // easier for this code being in an archive state

  // nine adopts, at which point I gave up
  [1, 2, 3, 4, 5, 6, 5, 6, 7, 8, 9].forEach((num) => {
    if (e.keyCode === KEYCODES[num]) {
      document.links[num - 1 + offset].click();
    }
  });

  // seven or eight adopts, using the colemak layout top row
  // can be adapted to 6 by removing the middle two
  ['q', 'w', 'f', 'p', 'l', 'u', 'y', 'semi'].forEach((key, index) => {
    if (e.keyCode === KEYCODES[key]) {
      document.links[index + offset].click();
    }
  });

  // when there are four adopts, using qwerty home row (right side)
  ['j', 'k', 'l', 'semi'].forEach((key, index) => {
    if (e.keyCode === KEYCODES[key]) {
      document.links[index + offset].click();
    }
  });

  // when there are three adopts, arrow keys work (and so do j/k/l above)
  ['left', 'down', 'right'].forEach((key, index) => {
    if (e.keyCode === KEYCODES[key]) {
      document.links[index + offset].click();
    }
  });

  // 'back' is always the first / only link on the wrong answer page
  if (e.keyCode === KEYCODES.up || e.keyCode === KEYCODES.i) {
    document.links[0].click();
    return;
  }

  // Special code for the feed page
  if (e.keyCode === KEYCODES.f) {
    feedLink = document.querySelector("a[href*='?act=doRareCandy']");
    if (feedLink) feedLink.click();
    return;
  }
};

if (window === top) {
  window.addEventListener('keyup', clickLink, false);
}
