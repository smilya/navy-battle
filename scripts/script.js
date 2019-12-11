let periscopeWidth = document.querySelector(".periscope").clientWidth;

let landscape = {
  element: document.querySelector(".landscape"),
  x: 0,
  width: 2000,
  _shiftMoveCounter: 0,
};

landscape.element.style.width = landscape.width + "px";
landscape.shift = Ship.prototype.shift;

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

let game;

class Game {
  constructor(level) {
    this.shipsLaunched = 0;
    this._shipsGone = 0;
    this.shipsHit = 0;
    this.shipsSunk = 0;
    this.shipsSunkInfo = document.querySelector(".gameInfo__shipsSunkText");
    this.level = level;
    this.gameLevelInfo = document.querySelector(".gameControl__levelText");
    this.launchDelay = 0;
    this.stop = false;    

    for (let ship in ships) {
      ships[ship].element.remove();
    }
    ships = {};
    torpedo.loadInfo.innerText = torpedo.load;
    this.gameLevelInfo.innerText = this.level;
    torpedo.capacityInfo.innerText = torpedo.capacity;
  }

  get shipsGone() {
    return this._shipsGone;
  }

  increaseShipsGone() {
    this._shipsGone += 1;
    // какое-то условие
    if (this.shipsGone - 1 > this.shipsSunk) {this.gameOver();}
  }

  launchShips(level) {
    if (this.stop == true) {return;}

    let shipTypeCode = randomInteger(1,3);
    let shipType;
    if (shipTypeCode == 1) {shipType = "small";}
    if (shipTypeCode == 2) {shipType = "medium";}
    if (shipTypeCode == 3) {shipType = "long";}
    let shipNumber = makeShip(shipType);

    let speedDelay;
    if (level == 1) {speedDelay = randomInteger(6, 10)*10;}
    if (level == 2) {speedDelay = randomInteger(5, 9)*10;}
    if (level == 3) {speedDelay = randomInteger(4, 8)*10;}
    ships[shipNumber].sail(speedDelay);
    ships[shipNumber].speedDelay = speedDelay;

    this.shipsLaunched += 1;

    let launchDelayCode;
    if (this.level == 1) {launchDelayCode = 8000;}
    if (this.level == 2) {launchDelayCode = 7000;}
    if (this.level == 3) {launchDelayCode = 6000;}
    this.launchDelay = randomInteger(1, 5)*launchDelayCode;     
    setTimeout(() => {
      this.launchShips(this.level);
    }, this.launchDelay);
  }

  gameStop() {
    for (let ship in ships) {
      ships[ship].stop = true;
    }    
    torpedo.stop = true;
    this.stop = true;
    messageBoard.innerText = "Игра приостановлена";
  }

  gameResume() {
    for (let ship in ships) {
      ships[ship].stop = false;
      ships[ship].sail(ships[ship].speedDelay);
    }
    torpedo.stop = false;
    this.stop = false;
    showMessage("Игра продолжена", 2000);
    setTimeout(() => {
      game.launchShips(game.level);
    }, this.launchDelay);    
  }

}

function newGame(level=1) {
  game = new Game(level);
  game.launchShips(game.level);
  landscape.x = -750;
  landscape.element.style.left = "-750px";
}


let gameControl = document.querySelector(".gameControl__gameButton");
gameControl.onclick = function() {
  if (gameControls.gameOn == false) {
    newGame(1); // ТУТ УРОВЕНЬ СЛОЖНОСТИ УСТАНОВИТЬ
    gameControls.gameOn = true;
    gameControls.gameButton.innerText = "СТОП";
    return;
  }

  if (gameControls.gameOn == true && game.stop == true) {
    gameControls.gameButton.innerText = "СТОП";
    game.gameResume();
    return;
  }

  else 
  { gameControls.gameButton.innerText = "ИГРА";
    game.gameStop();
    return;
  }

}

let gameControls = {
  gameButton: document.querySelector(".gameControl__button"),
  gameOn: false,
  
}


