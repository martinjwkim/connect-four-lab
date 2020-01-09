/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

// /** makeBoard: create in-JS board structure:
//  *    board = array of rows, each row is array of cells  (board[y][x])
function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    board[i] = [];
    for (let j = 0; j < WIDTH; j++) {
      board[i][j] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  let htmlBoard = document.getElementById("board");

  // initialize event listener for top row
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //makes 7 columns with id x
  for (var x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //repeats for each row
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    //makes 7 cells per column and assigns each cell an id of y-x
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

function findSpotForCol(x) {
  // gets column number and finds next empty cell starting from bottom row
  let emptySpot = HEIGHT - 1
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (board[i][x] === null) {
      emptySpot = i;
      return emptySpot
    }
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // makes div with classes piece and either p1 or p2
  let gamePiece = document.createElement("div");
  gamePiece.classList.add("piece");

  if (currPlayer === 1) {
    gamePiece.classList.add("p1");
  }

  if (currPlayer === 2) {
    gamePiece.classList.add("p2");
  }

  // adds div to spot in table at cell y-x
  let tableSpot = document.getElementById(`${y}-${x}`)
  tableSpot.appendChild(gamePiece);
}

// endGame: annouces end game message
function endGame(msg) {
  document.getElementById("endgame-msg").innerHTML = msg;
}

// handleClick: handle click of column top to play piece 
function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get y from next availble spot in column
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // places piece in table from x and y
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  //check if board is filled and announces tie game
  for (let i = HEIGHT - 1; i >= 0; i--) {
    var endGameCheck = board[i].every((column) => column !== null) ? true : false
  }
  if (endGameCheck === true) {
    endGame("It's a tie!");
  }

  // switch players
  currPlayer = (currPlayer === 1) ? 2 : 1;
}

// checkForWin: check board cell-by-cell for "does a win start here?"
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
