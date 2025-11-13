const Direction = Object.freeze({
  Left: { degrees: 270, col: -1, row: 0 },
  Right: { degrees: 90, col: 1, row: 0 },
  Up: { degrees: 0, col: 0, row: -1 },
  Down: { degrees: 180, col: 0, row: 1 },
});

function rotateElement(element, rotation = Direction.Top) {
  element.style.transform = `rotate(${rotation.degrees}deg)`;
  currentDirection = rotation;
}

function gameLoop(gameTiles2d, headTile, bodyTiles) {
  console.log(desiredDirection);
  // determine if can move in desired direction
  let potentialPosition = {
    row: headTile.row + desiredDirection.row,
    col: headTile.col + desiredDirection.col,
  };
  if (canChangeDirectionToDesired(potentialPosition, bodyTiles)) {
    currentDirection = desiredDirection;
  }
  else{
      // don't change direction - keep moving in current direction
      potentialPosition = {
        row: headTile.row + currentDirection.row,
        col: headTile.col + currentDirection.col,
      };
  }
  updateSnakePosition(potentialPosition, headTile, bodyTiles);
  //rotate head
  gameTiles2d[headTile.row][headTile.col].style.transform = `rotate(${currentDirection.degrees}deg)`;
  redrawSnake(gameTiles2d, headTile, bodyTiles);
  console.log(headTile, bodyTiles);
}

function canChangeDirectionToDesired(potentialPosition, bodyTiles) {
  existingTile = bodyTiles.find(
    (tile) =>
      tile.row === potentialPosition.row && tile.col === potentialPosition.col
  );
  // if we want to turn into ourself - don't allow
  if (existingTile === undefined) {
    return true;
  }
  return false;
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

  headTile.row = desiredPosition.row % ROW_COUNT;
  headTile.col = desiredPosition.col % COL_COUNT;
}
function redrawSnake(gameTiles2d, headTile, bodyTiles) {
  for (let row = 0; row < ROW_COUNT; row++) {
    for (let col = 0; col < COL_COUNT; col++) {
      if (row === headTile.row && col === headTile.col) {
        gameTiles2d[row][col].classList.add("snake-head");
        gameTiles2d[row][col].classList.remove("snake-body"); // change to state
        continue;
      } else {
        const bodyTile = bodyTiles.find(
          (tile) => tile.row === row && tile.col === col
        );
        if (bodyTile !== undefined) {
          gameTiles2d[row][col].classList.add("snake-body");
          gameTiles2d[row][col].classList.remove("snake-head"); // change to state
          continue;
        }
      }

      gameTiles2d[row][col].classList.remove("snake-head");
      gameTiles2d[row][col].classList.remove("snake-body");
    }
  }
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
const bodyTiles = [
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

let gameLoopInterval = null;

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
      gameLoopInterval = setInterval(
        gameLoop,
        300,
        gameTiles2d,
        headTile,
        bodyTiles
      ); // move every 200ms
      break;
    case "Escape":
      clearInterval(gameLoopInterval);
      break;
  }
});
