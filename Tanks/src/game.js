import InputHandler from "./input.js";
import Tank from "./tank.js";
import Terrain from "./terrain.js";
import AI from "./ai.js";
//import DQN from "./dqn.js";
import Collision from "./collision.js";
import { state } from "./state.js";
import { drawGrid } from "./drawgrid.js"

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  WIN: 5
};

let gameScreenDrawn = {
  PAUSED: false,
  MENU: false,
  GAMEOVER: false,
  WIN: false
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;

    this.maxLives = 10;
    this.lives = 10;
    this.livesCounter = "Lives: 10";
    this.blockSize = 40;

    this.trainingMode = 1;
    this.elapsedTime = 0;
    this.timeInterval = 200;

    this.terrain = new Terrain(this);
    this.terrain.buildWalls();
    this.tank = new Tank(this);
    this.ai = new AI(this);
    //this.DQN = new DQN(this)
    this.collision = new Collision(this);

    new InputHandler(this.tank, this);
  }

  currentState() {
    let aiStates = [];
    let i = 0;
    this.ai.tanks.forEach(tank => {
      aiStates[i] = state(tank);
      i += 1;
    });

    return [state(this.tank), ...aiStates];
  }

  start() {
    if (
      this.gamestate !== GAMESTATE.MENU &&
      this.gamestate !== GAMESTATE.GAMEOVER &&
      this.gamestate !== GAMESTATE.NEWLEVEL &&
      this.gamestate !== GAMESTATE.WIN
    )
      return;

    this.lives = this.maxLives;
    this.tank.respawn();
    this.terrain.buildWalls();
    this.ai.buildOpponents();
    this.setFireLimit(200);
    this.gamestate = GAMESTATE.RUNNING;
    drawGrid(this.gameWidth, this.gameHeight);
    //this.ai.fillQtable();
    //this.ai.loadQtable();
    this.ai.loadQtable().then(this.ai.initializeAI(200));

    //this.ai.buildSteps();
    //this.execAIroutine(250);
    //this.execSteps(400);
  }

  loseLife() {
    if (!this.trainingMode) {
      this.lives -= 1;
      this.tank.respawn();
    }
    if (this.lives < 1) this.gamestate = GAMESTATE.GAMEOVER;
  }

  setFireLimit(limit) {
    let game = this;
    setInterval(function() {
      if (game.tank.fireReady === 0) game.tank.fireReady = 1;
    }, limit);
    this.ai.tanks.forEach(tank => {
      setInterval(function() {
        if (tank.fireReady === 0) tank.fireReady = 1;
      }, limit);
    });
  }

  // needs reworking               *no more
  // execSteps(adt) {
  //   //this.ai.runSteps(adt);
  //   this.ai.initializeAI(adt);
  //   //setTimeout(this.ai.routine(), 1000);
  // }

  update(deltaTime) {
    if (this.lives === 0) {
      this.gamestate = GAMESTATE.GAMEOVER;
      return;
    }

    if (this.gamestate === GAMESTATE.RUNNING) {
      //collision logic goes here
      this.collision.check();

      this.ai.removeEmpty();
      this.ai.update(deltaTime);

      this.tank.update(deltaTime);

      gameScreenDrawn = {
        PAUSED: false,
        MENU: false,
        GAMEOVER: false,
        WIN: false
      };
    } else return;

    if (this.ai.tanks.length === 0) {
      this.gamestate = GAMESTATE.WIN;
      return;
    }
  }

  draw(ctx) {
    if (this.gamestate === GAMESTATE.PAUSED) {
      if (!gameScreenDrawn.PAUSED) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
      }
      gameScreenDrawn.PAUSED = true;
      return;
    }

    if (this.gamestate === GAMESTATE.MENU) {
      if (!gameScreenDrawn.MENU) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(
          "Press SPACEBAR To Start",
          this.gameWidth / 2,
          this.gameHeight / 2
        );
      }
      gameScreenDrawn.MENU = true;
      return;
    }
    if (this.gamestate === GAMESTATE.GAMEOVER) {
      if (!gameScreenDrawn.GAMEOVER) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
      }
      gameScreenDrawn.GAMEOVER = true;
      return;
    }
    if (this.gamestate === GAMESTATE.WIN) {
      if (!gameScreenDrawn.WIN) {
        ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN", this.gameWidth / 2, this.gameHeight / 2);
      }
      gameScreenDrawn.WIN = true;
      return;
    }

    ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);

    this.tank.draw(ctx);
    this.terrain.draw(ctx);
    this.ai.draw(ctx);
    this.livesCounter = "Lives: " + this.lives;

    if (this.trainingMode) {
      ctx.font = "13px Arial";
      ctx.fillStyle = "#00ff00";
      ctx.textAlign = "left";
      ctx.fillText("TRAINING MODE", 10, 20);
    } else {
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(this.livesCounter, this.gameWidth - 50, 30);
    }
  }

  togglePause() {
    if (this.gamestate == GAMESTATE.RUNNING) {
      this.gamestate = GAMESTATE.PAUSED;
    } else if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    }
  }

  pauseOnDefocus() {
    if (this.gamestate == GAMESTATE.RUNNING) {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
  endGame() {
    if (this.gamestate == GAMESTATE.RUNNING) {
      this.gamestate = GAMESTATE.GAMEOVER;
    }
  }
}
