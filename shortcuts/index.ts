/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

console.log('Hello via Bun!');
window.addEventListener('DOMContentLoaded', main);

type Board = Cell[][];
type ClickForest = {
  board: Board;
  position: [number, number];
  humanTurn: boolean;
  humanScore: number;
  puffScore: number;
};
type Cell =
  | { state: 'visited' }
  | { state: 'currentPosition' }
  | { state: 'unvisited'; value: number };

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

function parseBoardCell(td: HTMLTableCellElement): Cell {
  const img = td.querySelector('img');
  // const isHuman = img?.src.includes('X.gif');
  // const hasValue = Boolean(img?.alt);

  if (img?.src.includes('X.gif')) return { state: 'currentPosition' };
  if (!img?.alt) return { state: 'visited' };
  return { state: 'unvisited', value: parseInt(img.alt) };

  // const cellType = img?.src.includes('X.gif') ? 'human' : 'puff';

  // const props = img
  //   ? {
  //       clickable: !!td.querySelector('a'),
  //       isHuman: img.src.includes('X.gif'),
  //       alt: img.alt || 'n/a',
  //     }
  //   : null;
  // console.log(`props`, props);
  // return props;
}

function parseGameState(debug: boolean = false): ClickForest | null {
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

  const board = cells.map((row) => row.map(parseBoardCell));
  if (debug) console.log(`board`, board);
  if (!board) return null;

  // The scores table has just two rows & two columns, and we can use
  // querySelectorAll to get the text content of the first two cells.
  //
  // +-----+---------+
  // |  0  |    0    |
  // +-----+---------+
  // | You | Critter |
  // +-----+---------+
  //
  const scores = Array.from(tableScores.querySelectorAll('td')).map((td) => td.innerText);
  const [humanScore, puffScore] = scores.map((s) => parseInt(s));
  if (debug) console.log(`scores`, scores);
  if (!scores) return null;

  // Stupid way to get the current position
  // Map board to each row & then col, see if it has state: currentPosition
  const position = findCurrentPosition(board);
  return { board: board, humanTurn: true, humanScore, puffScore, position };
}

function findCurrentPosition(board: Cell[][]): [number, number] {
  let position: [number, number] | undefined;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j].state === 'currentPosition') {
        position = [i, j];
      }
    }
  }
  if (!position) throw new Error('Could not find current position');
  return position;
}

function main() {
  const b = parseGameState(true);
  console.log(b);
}