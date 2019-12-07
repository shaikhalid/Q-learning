import Fire from "./fire.js";
import { calculateReward } from "./calculateReward.js";
import { gridCoordinateOf } from "./positionToIndex.js";

export default class AITank {
  constructor(game, x, y) {
    this.game = game;

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.width = 30;
    this.height = 30;

    this.maxSpeed = 1;
    this.velX = 0;
    this.velY = 0;

    this.axis = "+Y";

    this.life = 1;

    this.position = {
      x: x,
      y: y
    };

    this.terrain = game.terrain;
    this.fires = [];
    this.fireReady = 1;
    this.noUpdate = 0;
    this.index = game.ai.tanks.indexOf(this);

    this.steps = [];

    //state vars
    this.action = null;
    this.reward = null;

    this.xOffsetFromTank = Math.abs(x - game.tank.position.x);
    this.yOffsetFromTank = Math.abs(y - game.tank.position.y);
    this.oldxOffset = null;
    this.oldyOffset = null;
    this.waitTime = 0;
  }

  moveLeft() {
    this.velX = -1;
    this.velY = 0;
    this.axis = "-X";
  }

  moveRight() {
    this.velX = 1;
    this.velY = 0;
    this.axis = "+X";
  }

  moveUp() {
    this.velX = 0;
    this.velY = -1;
    this.axis = "-Y";
  }

  moveDown() {
    this.velX = 0;
    this.velY = 1;
    this.axis = "+Y";
  }

  moving() {
    if (this.velX === 0 && this.velY === 0) return 0;

    return 1;
  }

  shoot() {
    if (this.fireReady) this.fires.push(new Fire(this));
    this.fireReady = 0;
  }

  stop() {
    //console.log("stopped");
    this.velX = 0;
    this.velY = 0;
  }

  lifeEnd() {
    if (!this.game.trainingMode) this.life = 0;
  }

  drawTankIndex(ctx) {
    ctx.font = "18px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(
      this.index,
      this.position.x + this.width / 2,
      this.position.y + this.height / 2 + 5
    );
  }

  drawMuzzle(ctx) {
    ctx.fillStyle = "#9f9f9f";
    if (this.axis === "+X")
      ctx.fillRect(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2 - 2,
        this.width / 2 + 3,
        5
      );
    if (this.axis === "-X")
      ctx.fillRect(
        this.position.x - 3,
        this.position.y + this.height / 2 - 2,
        this.width / 2 + 3,
        5
      );
    if (this.axis === "+Y")
      ctx.fillRect(
        this.position.x + this.width / 2 - 2,
        this.position.y + this.height / 2,
        5,
        this.width / 2 + 3
      );
    if (this.axis === "-Y")
      ctx.fillRect(
        this.position.x + this.width / 2 - 2,
        this.position.y - 3,
        5,
        this.width / 2 + 3
      );
  }

  draw(ctx) {
    if (this.life) {
      ctx.fillStyle = "#eee";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
      this.drawMuzzle(ctx);
      if (this.fires !== undefined)
        this.fires.forEach(fire => {
          fire.draw(ctx);
        });
      this.drawTankIndex(ctx);
    }
  }

  updatePosition() {
    if (this.noUpdate) {
      this.noUpdate = 0;
    } else {
      let count = this.maxSpeed;
      while (count) {
        if (!this.noUpdate) {
          if (this.axis === "+X" || this.axis === "-X")
            this.position.x += this.velX;
          if (this.axis === "+Y" || this.axis === "-Y")
            this.position.y += this.velY;
        }
        this.game.collision.check();
        count -= 1;
      }

      this.oldxOffset = this.xOffsetFromTank;
      this.oldyOffset = this.yOffsetFromTank;
      this.xOffsetFromTank = Math.abs(
        this.position.x - this.game.tank.position.x
      );
      this.yOffsetFromTank = Math.abs(
        this.position.y - this.game.tank.position.y
      );
    }
  }

  update(deltaTime) {
    //if (!this.reward) this.reward = calculateReward(this);
    //tank + boundary
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.y < 0) this.position.y = 0;
    if (this.position.x + this.width > this.gameWidth)
      this.position.x = this.gameWidth - this.width;
    if (this.position.y + this.height > this.gameHeight)
      this.position.y = this.gameHeight - this.height;

    this.updatePosition();

    if (this.fires !== undefined)
      this.fires.forEach(fire => {
        fire.update(deltaTime);
      });
    this.fires.forEach(fire => {
      if (fire.life === 0) {
        this.fires.splice(this.fires.indexOf(fire), 1);
      }
    });
  }
}
