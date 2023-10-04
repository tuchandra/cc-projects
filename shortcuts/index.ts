/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

console.log('Hello via Bun!');
window.addEventListener('DOMContentLoaded', main);

type Board = string[][];
type ClickForest = {
  board: Board;
  position: [number, number];
  humanTurn: boolean;
};
type Cell = {
  clickable: boolean;
  isHuman: boolean;
  alt: string;
};

// Board state possibilities ...
// - Size: 5x5, always
// - Human position: [0-4, 0-4]
// - Human turn: true/false
// - Human turn is always first
// - On a human turn, we can click on any cell in the same COLUMN
// - On a puff turn, we cannot do anything
//   (the puff will click on a cell in the same ROW, which becomes our position)
// - UI can sometimes be corrupted and show the PUFF move as clickable (with borders &
//   <a> child), but clicking it has no effect

function getContent(): HTMLElement | null {
  const megaContent = document.getElementById('megaContent');
  return megaContent?.querySelector('center') || null;
}

function parseCell(td: HTMLTableCellElement): Cell | null {
  const img = td.querySelector('img');
  if (!img) return null;

  // Is it clickable?
  const clickable = !!td.querySelector('a');

  // Are we there?
  const isHuman = img.src.includes('X.gif');

  // What's the alt text?
  const alt = img.alt || 'n/a';

  const props = { clickable, isHuman, alt };
  console.log(`props`, props);
  return props;
}

function parseBoard(debug: boolean = false): Board | null {
  const center = getContent();
  const table = center?.querySelector('table');
  if (!table) return null;

  // The table has <tbody> (without header), five <tr> rows, and five <td> cells per row
  // Print the contents of each <td> cell, row-wise starting at the top
  const rows = Array.from(table.querySelectorAll('tr'));
  if (!rows) return null;

  const cells: HTMLTableCellElement[][] = rows.map((row) => Array.from(row.querySelectorAll('td')));
  if (debug) console.log(`cells`, cells);
  if (!cells) return null;

  const board = cells.map((row) => row.map(parseCell).map((x) => x?.alt || 'n/a'));
  if (debug) console.log(`board`, board);
  if (!board) return null;

  return board;
}

function main() {
  const b = parseBoard(true);
  console.log(b);
}
