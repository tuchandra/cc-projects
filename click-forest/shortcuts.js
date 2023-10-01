const KEYCODES = {
  // arrows
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  // home row
  f: 70,
  j: 74,
  k: 75,
  l: 76,
  semi: 59,
  i: 73,
  apostrophe: 222,
  // numbers
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
};

const clickLink = (e) => {
  const offset = document.links[0].classList.length ? 0 : 1;

  [1, 2, 3, 4, 5, 6].forEach((num) => {
    if (e.keyCode === KEYCODES[num]) {
      document.links[num - 1 + offset].click();
    }
  });

  // Used when there were three or four adoptable choices
  // if (e.keyCode === KEYCODES.left || e.keyCode === KEYCODES.j) {
  //   document.links[0 + offset].click();
  //   return;
  // }
  // if (e.keyCode === KEYCODES.down || e.keyCode === KEYCODES.k) {
  //   document.links[1 + offset].click();
  //   return;
  // }
  // if (e.keyCode === KEYCODES.right || e.keyCode === KEYCODES.l) {
  //   document.links[2 + offset].click();
  //   return;
  // }

  // if (e.keyCode === KEYCODES.semi) {
  //   document.links[3 + offset].click();
  //   return;
  // }

  // back is always the first link
  if (e.keyCode === KEYCODES.up || e.keyCode === KEYCODES.i) {
    document.links[0].click();
    return;
  }

  if (e.keyCode === KEYCODES.f) {
    feedLink = document.querySelector("a[href*='?act=doRareCandy']");
    if (feedLink) feedLink.click();
    return;
  }
};

if (window === top) {
  window.addEventListener('keyup', clickLink, false);
}
