//enum
const Direction = Object.freeze({
  Left: { degrees: 270, col: -1, row: 0 },
  Right: { degrees: 90, col: 1, row: 0 },
  Up: { degrees: 0, col: 0, row: -1 },
  Down: { degrees: 180, col: 0, row: 1 },
});

// function rotateElement(element, rotation = Direction.Top) {
//   element.style.transform = `rotate(${rotation.degrees}deg)`;
//   currentDirection = rotation;
// }

function generateRandomFoodPosition(headTile, bodyTiles) {
  let randomRow, randomCol;
  let isValidPosition = false;
  while (!isValidPosition) {
    // Return a random integer between 0 and 15 (both included):
    randomRow = Math.floor(Math.random() * (ROW_COUNT - 1));
    randomCol = Math.floor(Math.random() * (COL_COUNT - 1));

    if (
      randomRow !== headTile.row &&
      randomCol !== headTile.col &&
      !bodyTiles.some(
        (tile) => tile.row === randomRow && tile.col === randomCol
      )
    ) {
      isValidPosition = true;
    }
  }
  return { row: randomRow, col: randomCol };
}

function resetGame() {
  desiredDirection = Direction.Up;
  currentDirection = Direction.Up;
  foodTile = { row: null, col: null };
  headTile = { row: 10, col: 10 };
  bodyTiles = [
    { row: 11, col: 10 },
    { row: 12, col: 10 },
  ];
  isGameStarted = false;
  isGameOver = false;
  clearInterval(gameLoopInterval);
  score = 0;
  document.getElementById("score").innerText = `Score: ${score}`;
}
function makeNewFood() {
  if (foodTile.row !== null && foodTile.col !== null) {
    return;
  }
  foodTile = generateRandomFoodPosition(headTile, bodyTiles);
  gameTiles2d[foodTile.row][foodTile.col].classList.add("state-food");
}
function hasColisionWithFood(headTile, foodTile) {
  return headTile.row === foodTile.row && headTile.col === foodTile.col;
}

async function gameLoop() {
  if (!isGameStarted) {
    return;
  }
  // determine if can move in desired direction
  let potentialPosition = {
    row: headTile.row + desiredDirection.row,
    col: headTile.col + desiredDirection.col,
  };
  if (canChangeDirectionToDesired(potentialPosition, bodyTiles)) {
    currentDirection = desiredDirection;
  } else {
    // don't change direction - keep moving in current direction
    potentialPosition = {
      row: headTile.row + currentDirection.row,
      col: headTile.col + currentDirection.col,
    };
  }
  updateSnakePosition(potentialPosition, headTile, bodyTiles);
  //rotate head

  redrawGameField(gameTiles2d, headTile, bodyTiles);
  gameTiles2d[headTile.row][
    headTile.col
  ].style.transform = `rotate(${currentDirection.degrees}deg)`;
  if (isGameOver) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // Show custom alert - click to reset game
    if (confirm("Game Over! Click OK to play again.")) {
      resetGame();
      // Clear all tiles
      for (let row = 0; row < ROW_COUNT; row++) {
        for (let col = 0; col < COL_COUNT; col++) {
          gameTiles2d[row][col].classList.remove(
            "state-snake-head",
            "state-snake-body",
            "state-food"
          );
          gameTiles2d[row][col].style.transform = "";
        }
      }     
      startGame();
    }
  }
}

function canChangeDirectionToDesired(potentialPosition, bodyTiles) {
  // let existingTile = bodyTiles.find(
  //   (tile) =>
  //     tile.row === potentialPosition.row && tile.col === potentialPosition.col
  // );

  const firstBodyTile = bodyTiles[0];

  let isWantToTurnInside =
    potentialPosition.row === firstBodyTile.row &&
    potentialPosition.col === firstBodyTile.col;

  // if we want to turn into ourself - don't allow
  if (isWantToTurnInside) {
    return false;
  }
  return true;
}
function consumeFood(oldRow,oldCol){
    foodTile = { row: null, col: null };
    //add new body tile at the end
    bodyTiles.push({ row: oldRow, col: oldCol });
    makeNewFood();
    score ++;
    document.getElementById("score").innerText = `Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      document.getElementById("high-score").innerText = `High Score: ${highScore}`;
    }
}
function updateSnakePosition(desiredPosition, headTile, bodyTiles) {
  // if (desiredPosition) {

  // // bodyTiles[bodyTiles.length - 1].row = headTile.row;
  // // bodyTiles[bodyTiles.length - 1].col = headTile.col;
  // }

  if (desiredPosition.row < 0) {
    desiredPosition.row = ROW_COUNT - 1;
  }
  if (desiredPosition.col < 0) {
    desiredPosition.col = COL_COUNT - 1;
  }
  let prevRow = bodyTiles[0].row; // cached
  let prevCol = bodyTiles[0].col;
  bodyTiles[0].col = headTile.col;
  bodyTiles[0].row = headTile.row;

  headTile.row = desiredPosition.row % ROW_COUNT;
  headTile.col = desiredPosition.col % COL_COUNT;

  let oldCol = prevCol;
  let oldRow = prevRow;
  for (let i = 1; i < bodyTiles.length; i++) {
    prevRow = bodyTiles[i].row;
    prevCol = bodyTiles[i].col;
    bodyTiles[i].row = oldRow;
    bodyTiles[i].col = oldCol;
    oldRow = prevRow;
    oldCol = prevCol;
  }
  if (hasColisionWithFood(headTile, foodTile)) {
    consumeFood(oldRow,oldCol);
  }
  //collision with self - defeat
  if (
    bodyTiles.some(
      (tile) => tile.row === headTile.row && tile.col === headTile.col
    )
  ) {
    isGameOver = true;
  }
}
function redrawGameField(gameTiles2d, headTile, bodyTiles) {
  for (let row = 0; row < ROW_COUNT; row++) {
    for (let col = 0; col < COL_COUNT; col++) {
      // Clear all state classes first
      gameTiles2d[row][col].classList.remove(
        "state-snake-head",
        "state-snake-body",
        "state-food"
      );

      if (row === headTile.row && col === headTile.col) {
        gameTiles2d[row][col].classList.add("state-snake-head");
      } else {
        const bodyTile = bodyTiles.find(
          (tile) => tile.row === row && tile.col === col
        );
        if (bodyTile !== undefined) {
          gameTiles2d[row][col].classList.add("state-snake-body");
        }
      }
    }
  }
  gameTiles2d[foodTile.row][foodTile.col].classList.add("state-food");
}

// grid 64 / 64
//
const ROW_COUNT = 16;
const COL_COUNT = 16;

let desiredDirection = Direction.Up;
let currentDirection = Direction.Up;
// let headTile = { row: null, col: null };
// const bodyTiles = [{ row: null, col: null }];

let headTile = { row: 10, col: 10 };
let bodyTiles = [
  { row: 11, col: 10 },
  { row: 12, col: 10 },
];

const grid = document.getElementById("grid-container");

for (let i = 0; i < ROW_COUNT * COL_COUNT; i++) {
  const cell = document.createElement("div");
  cell.classList.add("default-grid-cell");
  grid.appendChild(cell);
}

const tiles1d = grid.children;

const gameTiles2d = [];

for (let row = 0; row < ROW_COUNT; row++) {
  const rowTiles = [];
  for (let col = 0; col < COL_COUNT; col++) {
    const index = row * COL_COUNT + col;
    rowTiles.push(tiles1d[index]);
  }
  gameTiles2d.push(rowTiles);
}

// gameTiles2d[0][0].classList.add("snake-head");
// gameTiles2d[0][1].classList.add("snake-body");
// gameTiles2d[0][2].classList.add("snake-body");
// rotateElement(gameTiles2d[0][0], Direction.Left);

let foodTile = { row: null, col: null };
let gameLoopInterval = null;
let isGameStarted = false;
let isGameOver = false;
let score = 0;
let highScore = 0;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      desiredDirection = Direction.Left;
      console.log("left", desiredDirection);
      break;
    case "ArrowRight":
      desiredDirection = Direction.Right;
      break;
    case "ArrowUp":
      desiredDirection = Direction.Up;
      break;
    case "ArrowDown":
      desiredDirection = Direction.Down;
      break;
    case "Enter":
      startGame();
      break;
    case "Escape":
      if (!isGameStarted) {
        break;
      }
      isGameStarted = false;
      clearInterval(gameLoopInterval);
      break;
  }
});

function startGame(){
  if (isGameStarted) {
    return;
  }
  isGameStarted = true;
  makeNewFood();
  gameLoopInterval = setInterval(gameLoop, 300); // move every 200ms
} 

