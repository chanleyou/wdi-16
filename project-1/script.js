var gameBoard = document.querySelector("#game-board");
var floorDisplay = document.querySelector("#floor-display");
var lifeDisplay = document.querySelector("#life-display");
var updateStatement = document.querySelector("#update-statement");
var lifeNumber = document.querySelector("#life-number");

var boardArray = [];

var playerFloor = 1;
var playerLife = 100;
var playerScore = 0;

var beatsPerMinute = 120;
var pulse = 60000 / beatsPerMinute;

// is this redundant with class management and getPlayerTile function???
var playerTile;

var createBoard = function (rows, columns) {
  for (var i = 0; i < rows; i++) {
    var thisRow = [];
    var newRow = document.createElement("div");
    gameBoard.appendChild(newRow);
    newRow.classList.add("board-row");
    for (var y = 0; y < columns; y++) {
      var newSquare = document.createElement("div");
      newRow.appendChild(newSquare);
      newSquare.classList.add("game-square");
      thisRow.push(newSquare);
    }
    boardArray.push(thisRow);
  }
}

var getPlayerTile = function () {
  for (var y = 0; y < boardArray.length; y++) {
    if (boardArray[y].indexOf(playerTile) > -1) {
      return {
        yAxis: y,
        xAxis: boardArray[y].indexOf(playerTile)
      }
    }
  }
}

// to include: arrow keys
// keycodes:
// w: 87
// s: 83
// a: 65
// d: 68
var movePlayer = function (event) {

  var y = getPlayerTile().yAxis;
  var x = getPlayerTile().xAxis;

  var keyPressed = event.keyCode;
  switch (keyPressed) {
    case 87:
      console.log("W pressed.");
      attemptMove (y - 1, x);
      break;
    case 83:
      console.log("S pressed.");
      attemptMove(y + 1, x);
      break;
    case 65:
      console.log("A pressed.");
      attemptMove(y, x - 1);
      break;
    case 68:
      console.log("D pressed.");
      attemptMove(y, x + 1);
      break;
    default:
      console.log(keyPressed + ": invalid input.");
  }
}

var nextFloor = function () {

}

var gameOver = function () {
  playerTile.style.backgroundImage = `url("./images/sad-face.png")`;
  window.removeEventListener("keydown", movePlayer);
  updateStatement.textContent = "Game over :(";
}

var updatePlayerFloor = function () {
  scoreDisplay.textContent = playerScore;
}

var updatePlayerLife = function () {
  lifeDisplay.textContent = playerLife;

  if (playerLife <= 30) {
    lifeDisplay.style.color = "red";
  } else if (playerLife <= 50) {
    lifeDisplay.style.color = "yellow";
  } else {
      lifeDisplay.style.color = "black";
  }
  return playerLife;
}


// takes in damage as parameter and returns true if player died, false otherwise
var playerLoseLife = function (damage) {
  playerLife -= damage;
  updatePlayerLife();

  if (playerLife <= 0) {
    gameOver ();
    return true;
  } else {
    return false;
  }
}

// return true if movement if possible
var attemptMove = function (y, x) {
  console.log(`Attempting move to ${y}, ${x}.`);

  if (y < 0 || x < 0 || y >= boardArray.length || x >= boardArray[0].length) {
    console.log("Movement failed due to exceeding boundaries of grid.");
    return;
  }

  var targetTile = boardArray[y][x];

  if (targetTile.classList.contains("wall")) {
    console.log("Player tried to enter wall.");
    return;
  }

  playerTile.classList.replace("player-tile", "wall");
  targetTile.classList.add("player-tile");
  playerTile = targetTile;

  if (targetTile.classList.contains("warning-tile")) {
    console.log("Player entering warning tile.")
    if (playerLoseLife(1)) {
      return;
    }
  } else if (targetTile.classList.contains("danger-tile")) {
    console.log("Player entering danger tile.")
    if (playerLoseLife(10)) {
      return;
    }
  } else if (targetTile.classList.contains("next-floor")) {
    console.log("Player entering next floor tile.");
    nextFloor();
    playerFloor++;
    playerScore += 10;
    return;
  }
}

// what should pulse do?
// warning tiles turn into danger tiles
// danger tiles turn into warning tiles
// player takes damage based on tile change



var pulseFunction = function () {
  console.log("Pulse.");
}

// load all DOM-dependent functions???
window.onload = function () {
  window.addEventListener("keydown", movePlayer);

  // setInterval(pulseFunction, pulse);
}

// for testing purposes
// TO BE CODED DYNAMICALLY
createBoard(8, 10);

// TO BE CODED DYNAMICALLY
// player starting tile is boardArray(row - 1, column 0);
// exit tile is 0, columns - 1;
playerTile = boardArray[7][0];
playerTile.classList.add("player-tile");
boardArray[0][9].classList.add("next-floor");
boardArray[5][7].classList.add("warning-tile");
boardArray[4][5].classList.add("danger-tile");
boardArray[3][3].classList.add("wall");

var startGame = function () {

}

// make tiles die when player leaves
