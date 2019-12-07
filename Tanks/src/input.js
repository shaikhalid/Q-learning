export default class InputHandler {
  constructor(tank, game) {
    document.getElementById("ri").addEventListener("click", ()=>  {
      let rele =  document.getElementById("randomness")
      if(parseFloat(rele.innerHTML)<1)
      rele.innerHTML = parseFloat(rele.innerHTML) + 0.1;
    });

    document.getElementById("rd").addEventListener("click", ()=>  {
      let rele =  document.getElementById("randomness")
      if(parseFloat(rele.innerHTML)>0)
      rele.innerHTML = parseFloat(rele.innerHTML) - 0.1;
    });

    document.addEventListener("keydown", event => {
      //alert(event.keyCode);
      switch (event.keyCode) {
        case 65:
          if (game.gamestate === 0) return;
          //tank.stop();
          tank.moveLeft();
          break;

        case 87:
          if (game.gamestate === 0) return;
          //tank.stop();
          tank.moveUp();
          break;

        case 68:
          if (game.gamestate === 0) return;
          //tank.stop();
          tank.moveRight();
          break;

        case 83:
          if (game.gamestate === 0) return;
          //tank.stop();
          tank.moveDown();
          break;

        case 16:
          if (game.gamestate === 0) return;
          tank.shoot();
          break;

        case 27:
          game.togglePause();
          break;

        case 32:
          game.start();
          break;

        case 45:
          if (game.trainingMode) game.terrain.buildWalls();
          break;

        case 46:
          if (game.trainingMode) game.terrain.clear();
          break;
        case 35:
          if (game.trainingMode) game.endGame();
          break;
      }
    });
    document.addEventListener("keyup", event => {
      switch (event.keyCode) {
        case 65:
          tank.stopInX();
          break;

        case 87:
          tank.stopInY();
          break;

        case 68:
          tank.stopInX();
          break;

        case 83:
          tank.stopInY();
          break;
      }
    });
    window.addEventListener("blur", event => {
      game.pauseOnDefocus();
    });
  }
}
