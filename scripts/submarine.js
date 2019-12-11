let torpedo = {
  element: document.querySelector(".torpedo"),
  side: "torpedo-left",
  load: 15,
  loadInfo: document.querySelector(".gameInfo__torpedosText"),
  capacity: 1,
  capacityInfo: document.querySelector(".gameInfo__capacityText"),
  torpedoContainerX: 0,
  stop: false,
  
  reload() {
    torpedo.stop = true;
    showMessage("Идет погрузка торпед на борт", 7000);
    setTimeout(() => { 
      torpedo.stop = false;
      torpedo.load += 10;
      torpedo.loadInfo.innerText = torpedo.load;
    }, 7000);        
  }
};

let torpedoContainer = document.querySelector(".torpedo-container");

function shiftView(direction) {
  if (landscape.x >= 0 && direction == "left") {return;}
  if (landscape.x <=  periscopeWidth - landscape.width && direction == "right") {return;}

  landscape.shift(direction);
}

function longShiftView(direction, delay) {
  if (longShiftView._repeatCounter == 10) {
    longShiftView._repeatCounter = 0;
    return;
  }
  shiftView(direction);
  longShiftView._repeatCounter += 1;
  setTimeout(longShiftView, delay, direction, delay);
}

longShiftView._repeatCounter = 0;

function torpedoLaunch() {
  if (torpedo.stop == true) {   
    return;
  }

  if (torpedo.load == 0) {
    messageBoard.innerText = "Торпеды израсходованы";
    return;
  }

  if (torpedo.element.classList.contains("torpedo-reload")) {
      showMessage("Идет перезарядка торпедных аппаратов", 1000);
      return;}
  torpedo.torpedoContainerX = - landscape.x;
  torpedoContainer.style.left = torpedo.torpedoContainerX + "px";
  torpedo.element.classList.add(torpedo.side);
  torpedo.element.classList.add("torpedo-reload");
  torpedo.load -= 1;
  torpedo.loadInfo.innerText = torpedo.load;
  setTimeout(() => {
    torpedo.element.classList.remove("torpedo-reload");
  }, 7000);
  setTimeout(()=>{
    getTarget();
    torpedo.element.classList.remove(torpedo.side);    
    if (torpedo.side == "torpedo-left") {torpedo.side = "torpedo-right"; return;};
    if (torpedo.side == "torpedo-right") {torpedo.side = "torpedo-left"; return;};
  }, 5000);
}

function getTarget() {
  let torpedoX;
  if(torpedo.side == "torpedo-left") {torpedoX = torpedo.torpedoContainerX + 220;}
  if(torpedo.side == "torpedo-right") {torpedoX = torpedo.torpedoContainerX + 280;}
  
  for (let key in ships) {
    if (torpedoX >= ships[key].x && torpedoX <= ships[key].x1) {
      boom(ships[key].number, torpedo.capacity);
      return;
    }
  }
  showMessage ("Торпеда потеряна", 1000);   
}

let messageBoard = document.querySelector(".message");

function showMessage(message, time) {
  messageBoard.innerText = message;
  setTimeout(() => {
    messageBoard.innerHTML = "";
  }, time);
}

addEventListener("keydown", function(event) {
  if (event.keyCode == 37) {
    longShiftView("left", 35);
  }
  
  if (event.keyCode == 39) {
    longShiftView("right", 50);
  }

  if (event.keyCode == 32) {
    torpedoLaunch();
  }  

});
