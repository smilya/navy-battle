let shipsContainer = document.getElementById("ships");
let ships = {};

class Ship {
  constructor(shipType, number) {
    this.stop = false;
    this.number = number;
    this.shipType = shipType;
    this.speedDelay = 0;

    let div = document.createElement("div");
    div.className = "ship";
    div.classList.add(shipType);
    div.id = number;
    shipsContainer.append(div);
    
    this.element = document.getElementById(number);
  }
  
  get x1() {
    return (this.x + this.length);
  }

  shift(direction) {
    let directionStep;
    if (direction == "left") {directionStep = 1};
    if (direction == "right") {directionStep = -1};

    this.x += directionStep;
    this.element.style.left = this.x +"px";    
  }

  sail (delay) { //delay=50
    if (this.stop == true) {
      this.stop = false;
      return;
    }
    if (this.x == landscape.width){
      this.element.remove();
      delete ships[this.number];
      return;
    };
    this.x += 1;
    this.element.style.left = this.x + "px";
    setTimeout(()=> {this.sail(delay)}, delay);
  }

}

function MakeShip() {
  let counter = 0;
  return function(shipType)  {
    let newShip = new Ship(shipType, counter);
    if (shipType == "small") {
      newShip.length = 30;
      newShip.x = - newShip.length;    
      newShip.endurance = 1;  
    }
    if (shipType == "medium") {
      newShip.length = 50;
      newShip.x = - newShip.length;    
      newShip.endurance = 2;
    }
    if (shipType == "long") {
      newShip.length = 70;
      newShip.x = - newShip.length;  
      newShip.endurance = 3;
    }
    newShip.element.style.left = newShip.x + "px";
    ships[counter] = newShip;
    counter++;
    return (counter -1 );
  }
}

let makeShip = MakeShip();

function boom(shipNumber, torpedoCapacity) {
  
  function injuryBoom() {
    ships[shipNumber].element.classList.add("boom");
    setTimeout(() => {
      ships[shipNumber].element.classList.remove("boom");
    }, 1000);
  }  

  ships[shipNumber].endurance -= torpedo.capacity;
  if (ships[shipNumber].endurance == 2) {
    setTimeout(() => {
      ships[shipNumber].element.classList.add("wounded");
    }, 1000);    
    injuryBoom();
  }
  if (ships[shipNumber].endurance == 1) {
    setTimeout(() => {      
      ships[shipNumber].element.classList.add("wounded-badly");
    }, 1000); 
    ships[shipNumber].element.classList.remove("wounded");
    injuryBoom();
  }
  if (ships[shipNumber].endurance <= 0) {
    ships[shipNumber].stop = true;
    ships[shipNumber].element.classList.remove("wounded");
    ships[shipNumber].element.classList.remove("wounded-badly");
    ships[shipNumber].element.classList.add("killed");
    game.shipsSunk += 1;
    game.shipsSunkInfo.innerText = game.shipsSunk;
    if (game.shipsSunk % 5 == 0) {
      torpedo.reload();
    }
    if (game.shipsSunk % 10 == 0 && game.shipsSunk % 30 != 0 && game.level < 3) {
      torpedo.capacity += 1;
      torpedo.capacityInfo.innerText = torpedo.capacity;
      setTimeout(() => {
        showMessage("Получены более мощные торпеды", 2000)
      }, 5000);
    }
    if (game.shipsSunk % 30 == 0 && game.level < 3) {
      torpedo.capacity = 2;
      torpedo.capacityInfo.innerText = torpedo.capacity;
      game.level += 1;
      game.gameLevelInfo.innerText = game.level;
      setTimeout(() => {
        showMessage("Новый уровень сложности", 2000)
      }, 7000);
    }
  
    setTimeout(() => {
      ships[shipNumber].element.classList.remove("killed");
      ships[shipNumber].element.remove();
      delete ships[shipNumber];
    }, 2000);

  };
}
