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

/**
 * Board state modeling ...
 *
 * The board is a 5x5 grid. We are always somewhere on the grid, starting in the
 * middle.
 *
 * Each square is exactly one of:
 * - our current location
 * - a cell that has been visited
 * - a cell that has not been visited
 *
 * Each unvisited square has an integer score associated with it, between
 * -4 and 4 and excluding 0.
 *
 * The game proceeds as:
 * - Human moves first
 * - On our turn, we can move to any unvisited cell in our *column*. The
 *   cell's score is added to our score.
 * - On Puff turn, it can move to any unvisited cell in its *row*. The
 *   cell's score is added to the Puff's score.
 * - On either, the game ends if there are no possible moves for the player
 * - We win if our score > Puff's score (tie = Puff wins).
 *
 * We start in the middle of the board - (2, 2) when zero-indexed - with
 * all four cells in the column visitable.
 *
 * |---|---|---|---|---|
 * | X | X | ? | X | X |  <- ? = ...
 * | X | X | ? | X | X |  <- ? = candidate move
 * | X | X | * | X | X |  <- * = our position
 * | X | X | ? | X | X |  <- ? = candidate move
 * | X | X | ? | X | X |  <- ? = ...
 * |---|---|---|---|---|
 *
 * Note that we can't rely on the UI to tell us which cells are visitable. The frontend
 * state will sometimes get corrupted (when refreshing or resuming an in-progress game)
 * and appear as if we can choose where to go on the Puff's turn (horizontally). This
 * isn't actually the case, so we need to keep track of the board state ourselves.
 */

function getContent(): HTMLElement | null {
  const megaContent = document.getElementById('megaContent');
  return megaContent?.querySelector('center') || null;
}

function parseBoardCell(td: HTMLTableCellElement): Cell | null {
  const img = td.querySelector('img');
  const props = img
    ? {
        clickable: !!td.querySelector('a'),
        isHuman: img.src.includes('X.gif'),
        alt: img.alt || 'n/a',
      }
    : null;
  console.log(`props`, props);
  return props;
}

function parseBoard(debug: boolean = false): Board | null {
  const center = getContent();
  const tables = center?.querySelectorAll('table');
  if (!tables) return null;

  const [tableBoard, tableScores] = Array.from(tables);

  // The table has <tbody> (without header), five <tr> rows, and five <td> cells per row
  // Print the contents of each <td> cell, row-wise starting at the top
  const rows = Array.from(tableBoard.querySelectorAll('tr'));
  if (!rows) return null;

  const cells: HTMLTableCellElement[][] = rows.map((row) => Array.from(row.querySelectorAll('td')));
  if (debug) console.log(`cells`, cells);
  if (!cells) return null;

  const board = cells.map((row) => row.map(parseBoardCell).map((x) => x?.alt || 'n/a'));
  if (debug) console.log(`board`, board);
  if (!board) return null;

  // The scores table has just two rows & two columns
  // |  0  |    0    |
  // | You | Critter |
  // We can use querySelectorAll and take the first two scores
  const scores = Array.from(tableScores.querySelectorAll('td')).map((td) => td.innerText);
  if (debug) console.log(`scores`, scores);
  if (!scores) return null;

  return board;
}

function main() {
  const b = parseBoard(true);
  console.log(b);
}
