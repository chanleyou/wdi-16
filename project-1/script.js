var gameBoard = document.querySelector("#game-board");
var floorDisplay = document.querySelector("#floor-display");
var lifeDisplay = document.querySelector("#life-display");
var updateStatement = document.querySelector("#update-statement");
var lifeNumber = document.querySelector("#life-number");

var playerFloor = 1;
var playerLife = 100;

var beatsPerMinute = 60;
var tick = 60000 / beatsPerMinute;

var boardArray = [];

var playerTile;
var enemyTick;

var createBoard = function (rows, columns) {
  boardArray = [];

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
      attemptMove (y - 1, x);
      break;
    case 83:
      attemptMove(y + 1, x);
      break;
    case 65:
      attemptMove(y, x - 1);
      break;
    case 68:
      attemptMove(y, x + 1);
      break;
  }
}

populateBoard = function() {

  for (i = 0; i < playerFloor; i++) {
    var randomChoice = Math.floor(Math.random()*3);
    var randomRow;
    var randomColumn;

    do {
      randomRow = Math.floor(Math.random()*8);
      randomColumn = Math.floor(Math.random()*10);
    } while ((randomRow < 2 && randomColumn > 7) || (randomRow > 5 && randomColumn < 2))

    switch (randomChoice) {
      case 0:
        boardArray[randomRow][randomColumn].classList.add("warning-tile");
        break;
      case 1:
        boardArray[randomRow][randomColumn].classList.add("danger-tile");
        break;
      case 2:
        boardArray[randomRow][randomColumn].classList.add("enemy-tile");

    }
  }
}

// removing all children 1 by 1 is computationally faster than using innerHTML = ""
// make player and next floor tile random?
newFloor = function () {
  gameBoard.innerHTML = "";
  createBoard(8, 10);
  playerTile = boardArray[7][0];
  playerTile.classList.add("player-tile");
  boardArray[0][9].classList.add("next-floor");
  populateBoard();
}

var nextFloor = function () {
  playerFloor++;
  newFloor();
  updatePlayerFloor();
}

var gameOver = function () {
  playerTile.style.backgroundImage = `url("./images/sad-face.png")`;
  window.removeEventListener("keydown", movePlayer);
  updateStatement.textContent = "Game over :(";
  clearInterval(enemyTick);
}

var updatePlayerFloor = function () {
  floorDisplay.textContent = playerFloor;
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

  if (y < 0 || x < 0 || y >= boardArray.length || x >= boardArray[0].length) {
    console.log("Movement failed due to exceeding boundaries of grid.");
    return;
  }

  var targetTile = boardArray[y][x];

  if (targetTile.classList.contains("wall")) {
    console.log("Player tried to enter wall.");
    return;
  }

  playerTile.classList.remove("player-tile");
  targetTile.classList.add("player-tile");
  playerTile = targetTile;

  if (targetTile.classList.contains("enemy-tile")) {
    console.log("Player entering enemy tile.");
    if (playerLoseLife(5)) {
      return;
    }
    targetTile.classList.remove("enemy-tile");
  }

  if (targetTile.classList.contains("warning-tile")) {
    console.log("Player entering warning tile.");
    if (playerLoseLife(1)) {
      return;
    }
  } else if (targetTile.classList.contains("danger-tile")) {
    console.log("Player entering danger tile.");
    if (playerLoseLife(10)) {
      return;
    }
  } else if (targetTile.classList.contains("next-floor")) {
    console.log("Player entering next floor tile.");
    nextFloor();
    return;
  }
}


// enemies chase the player every second
var tickFunction = function () {
  var enemies = document.querySelectorAll(".enemy-tile");

  for (var i = 0; i < enemies.length; i++) {
    var thisEnemy = enemies[i];
    var yThisEnemy;
    var xThisEnemy;

    for (var y = 0; y < boardArray.length; y++) {
      if (boardArray[y].indexOf(thisEnemy) > -1) {
        yThisEnemy = y;
        xThisEnemy = boardArray[y].indexOf(thisEnemy);
        break;
      }
    }

    var yOffset = yThisEnemy - getPlayerTile().yAxis;
    var xOffset = xThisEnemy - getPlayerTile().xAxis;

    var targetTile;

    if (yOffset > 0) {
      targetTile = boardArray[yThisEnemy - 1][xThisEnemy];
    } else if (yOffset < 0) {
      targetTile = boardArray[yThisEnemy + 1][xThisEnemy];
    } else if (xOffset > 0) {
      targetTile = boardArray[yThisEnemy][xThisEnemy - 1];
    } else if (xOffset < 0) {
      targetTile = boardArray[yThisEnemy][xThisEnemy + 1];
    }

    if (targetTile.classList.contains("enemy-tile")) {
    } else {
      thisEnemy.classList.remove("enemy-tile");
    } if (targetTile.classList.contains("player-tile")) {
      playerLoseLife(5);
    } else {
      targetTile.classList.add("enemy-tile");
    }
  }
}

var startGame = function () {
  updatePlayerLife();
  updatePlayerFloor();
  newFloor();
}

// load all DOM-dependent functions???
window.onload = function () {
  window.addEventListener("keydown", movePlayer);
  startGame();
  newFloor();

  enemyTick = setInterval(tickFunction, tick);
}
