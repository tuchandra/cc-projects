/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

window.addEventListener('DOMContentLoaded', main);

class ParseError extends Error {}

/**
 * We can hardcode the fact that the Click Forest board is 5x5.
 * The TypeScript compiler is smart enough to tell us about
 * out-of-bounds errors, so let's take advantage of that.
 */
type FiveOf<T> = [T, T, T, T, T];
type AltBoard = FiveOf<FiveOf<Cell>>;

type Player = 'human' | 'puff';

type Position = [number, number];
type CellState = 'currentPosition' | 'visited' | 'unvisited';
type Cell =
  | { state: 'currentPosition' }
  | { state: 'visited' }
  | { state: 'unvisited'; value: number; clickable: boolean };
type Board = Cell[][];
type ClickForest = {
  board: Board;
  position: Position;
  whoseTurn: Player;
  scores: Record<Player, number>;
};

/** Find the current position on the board. */
function findCurrentPosition(board: Board): Position {
  let position: Position | undefined;
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

/**
 * Is this the human's turn? Decide based on board & current position.
 * (If the cells in the same column are clickable - or unvisitable - then yes.)
 */
function isHumanTurn({ board, position: [_, col] }: { board: Board; position: Position }): boolean {
  return board.every((row) => {
    const cell = row[col];
    return (
      cell.state === 'currentPosition' ||
      cell.state === 'visited' ||
      (cell.state === 'unvisited' && cell.clickable)
    );
  });
}

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

/**
 * Parse the page content into the two tables that represent the game state: the board/map
 * and the scores. Throw a ParseError on failure.
 */
function getContent(): [HTMLTableElement, HTMLTableElement] {
  const contentTables = document.getElementById('megaContent')?.querySelectorAll('table');
  const [tableBoard, tableScores] = Array.from(contentTables || [,]);

  if (!tableBoard || !tableScores) throw new ParseError('Could not parse game state.');

  return [tableBoard, tableScores];
}

/**
 * Parse a <td> cell into the Cell struct that it represents in the game.
 * It should always have an image, which is either:
 * - X.gif: a picture of the human / where we currently are
 * - no alt text: a visited cell
 * - a number with alt text: the score of the cell
 */
function parseBoardCell(td: HTMLTableCellElement): Cell {
  const img = td.querySelector('img');
  if (!img) throw new ParseError(`Board cell doesn't have an image; what?`);

  if (img.src.includes('X.gif')) return { state: 'currentPosition' };
  if (!img.alt) return { state: 'visited' };
  return { state: 'unvisited', value: parseInt(img.alt), clickable: !!td.querySelector('a') };
}

/**
 * The table has <tbody> (without header), five <tr> rows, and five <td> cells per row
 * Parse the contents of each <td> into a Cell.
 */
function parseGameBoard(table: HTMLTableElement): Board {
  const tableRows = Array.from(table.querySelectorAll('tr'));
  const tableDatas = tableRows.map((row) => Array.from(row.querySelectorAll('td')));

  return tableDatas.map((td) => td.map(parseBoardCell));
}

/**
 * The scores table has just two rows & two columns, and we can use
 * querySelectorAll to get the text content of the first two cells.
 *
 * +-----+---------+
 * |  0  |    0    |
 * +-----+---------+
 * | You | Critter |
 * +-----+---------+
 *
 * The first cell is the human score, the second is the puff score.
 */
function parseScores(table: HTMLTableElement): Record<Player, number> {
  const scores = Array.from(table.querySelectorAll('td')).map((td) => td.innerText);
  const [humanScore, puffScore] = scores.map((s) => parseInt(s));
  if (!scores) throw new ParseError('Could not parse scores.');
  return { human: humanScore, puff: puffScore };
}

function getGameState(debug: boolean = false): ClickForest | null {
  const [tableBoard, tableScores] = getContent();

  const board = parseGameBoard(tableBoard);
  const position = findCurrentPosition(board);
  const humanTurn = isHumanTurn({ board, position }) ? 'human' : 'puff';
  const scores = parseScores(tableScores);

  return { board: board, whoseTurn: humanTurn, scores, position };
}

function main() {
  try {
    const b = getGameState(true);
    console.log(b);
  } catch (e) {
    console.debug(e);
  }
}
