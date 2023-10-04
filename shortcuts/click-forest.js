// @ts-check
window.addEventListener('DOMContentLoaded', main);

/**
 * Type definitions; these are entirely for VS Code because I can't be bothered
 * to set up a build pipeline and transpile a one-and-done browser extension.
 *
 *
 */

/**
 * @param {boolean} debug
 * @returns {string[][] | null}
 */
function parseBoard(debug = false) {
  const megaContent = document.getElementById('megaContent');
  if (debug) console.log(`megaContent`, megaContent);
  if (!megaContent) return null;

  const table = megaContent.querySelector('center table');
  if (debug) console.log(`table`, table);
  if (!table) return null;

  // The table has <tbody> (without header), five <tr> rows, and five <td> cells per row
  // Print the contents of each <td> cell, row-wise starting at the top
  const rows = table.querySelectorAll('tr');
  if (debug) console.log(`rows`, rows);
  if (!rows) return null;

  const cells = Array.from(rows).map((row) => Array.from(row.querySelectorAll('td')));
  if (debug) console.log(`cells`, cells);
  if (!cells) return null;

  const board = cells.map((row) =>
    row.map((cell) => {
      if (!cell) return 'n/a';
      const img = cell.querySelector('img');
      return img ? img.alt : 'n/a';
    }),
  );
  if (debug) console.log(`board`, board);
  if (!board) return null;

  return board;
}

function main() {
  const b = parseBoard(true);
  console.log(b);
}
