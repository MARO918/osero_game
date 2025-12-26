// ----- 初期設定 -----
const boardSize = 8;
let board = [];
let currentPlayer = "black"; // 黒からスタート

// 空ボード作成
for (let i = 0; i < boardSize; i++) {
  board[i] = Array(boardSize).fill(null);
}

// 初期配置
board[3][3] = "white";
board[3][4] = "black";
board[4][3] = "black";
board[4][4] = "white";

const boardDiv = document.getElementById("board");

// ボード描画
function drawBoard() {
  boardDiv.innerHTML = "";
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (board[y][x]) {
        const stone = document.createElement("div");
        stone.className = "stone " + board[y][x];
        cell.appendChild(stone);
      }

      cell.onclick = () => handleClick(x, y);
      boardDiv.appendChild(cell);
    }
  }
}

drawBoard();

// 8方向
const directions = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [-1, -1], [1, -1], [-1, 1]
];

// ----- クリック処理 -----
function handleClick(x, y) {
  if (board[y][x] !== null) return;

  // ひっくり返せる石
  const flipCells = getFlippableCells(x, y, currentPlayer);

  if (flipCells.length === 0) return; // 合法手でなければ無視

  // 石を置く
  board[y][x] = currentPlayer;

  // ひっくり返す
  for (const [fx, fy] of flipCells) {
    board[fy][fx] = currentPlayer;
  }

  // 手番交代
  currentPlayer = currentPlayer === "black" ? "white" : "black";

  drawBoard();
}

// ----- 石がひっくり返るマスを取得 -----
function getFlippableCells(x, y, player) {
  const opponent = player === "black" ? "white" : "black";
  let flippable = [];

  for (const [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    let temp = [];

    while (
      ny >= 0 && ny < boardSize &&
      nx >= 0 && nx < boardSize &&
      board[ny][nx] === opponent
    ) {
      temp.push([nx, ny]);
      nx += dx;
      ny += dy;
    }

    if (
      ny >= 0 && ny < boardSize &&
      nx >= 0 && nx < boardSize &&
      board[ny][nx] === player &&
      temp.length > 0
    ) {
      flippable.push(...temp);
    }
  }
  return flippable;
}
