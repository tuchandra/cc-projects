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
  // top row, colemak
  q: 81,
  w: 87,
  // f
  p: 80,
  g: 71,
  // j, l
  u: 85,
  y: 89,
  // numbers
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  0: 48,
};

const clickLink = (e) => {
  const offset = document.links[0].classList.length ? 0 : 1;

  [1, 2, 3, 4, 5, 6, 5, 6, 7, 8, 9].forEach((num) => {
    if (e.keyCode === KEYCODES[num]) {
      document.links[num - 1 + offset].click();
    }
  });

  ['q', 'w', 'f', 'p', 'l', 'u', 'y', 'semi'].forEach((key, index) => {
    if (e.keyCode === KEYCODES[key]) {
      document.links[index + offset].click();
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

// For rebuilding the layout so it's less wide - unused, just a POC that I didn't finish

function main() {
  const questionImage = document.images[0];
  const { width, height } = questionImage;

  // Set an id on the parent div for convenience
  const questionDiv = questionImage.parentElement;
  questionDiv.style.height = `${2 * height + 20}px`;

  // New layout depends on how many adopts there are
  // Always two rows, split half and half, with extras in the first row
  const nAdopts = width / 100;
  if (nAdopts <= 6) return;

  const nAdoptsTop = Math.ceil(nAdopts / 2);
  const nAdoptsBottom = nAdopts - nAdoptsTop;

  const widthTop = nAdoptsTop * 100;
  const widthBottom = nAdoptsBottom * 100;

  // The question text is the top 10px of the image, so extract and crop that
  const questionText = document.createElement('img');
  questionText.src = questionImage.src;
  questionText.width = width;
  questionText.height = 20;
  questionText.style.objectFit = 'cover';
  questionText.style.objectPosition = 'top';

  // Insert the question text before the image
  questionImage.parentNode.insertBefore(questionText, questionImage);

  // crop the first image to keep the left-half only
  questionImage.width = widthTop;
  questionImage.height = height;
  questionImage.style.objectFit = 'cover';
  questionImage.style.objectPosition = 'left';

  // create another copy of the image underneath
  const newImage = document.createElement('img');
  newImage.src = questionImage.src;

  // crop the second image to keep the right-half only
  newImage.width = widthBottom;
  newImage.height = height;
  newImage.style.display = 'block';
  newImage.style.objectFit = 'cover';
  newImage.style.objectPosition = 'right';

  // insert
  questionImage.parentNode.insertBefore(newImage, questionImage.nextSibling);

  // This took care of the images, but the links are laid out in a way that's really hard to change
  // A lot of position: absolute and assumptions about the layout being, you know, the real layout
  // Giving up
}

// window.addEventListener('load', main, false);
