import { calculateReward } from "./calculateReward.js";

export default class Fire {
  constructor(tank) {
    this.game = tank.game;
    this.screenX = tank.game.gameWidth;
    this.screenY = tank.game.gameHeight;

    this.position = {
      x: tank.position.x + tank.width / 2 - 2,
      y: tank.position.y + tank.height / 2 - 2
    };

    this.width = 5;
    this.height = 5;

    this.life = 1;

    this.vel = 5;
    this.axis = tank.axis;
  }

  draw(ctx) {
    if (!this.life) return;
    ctx.fillStyle = "#ddd";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(deltatime) {
    if (!this.life) return;

    let count = this.vel;
    while (count) {
      if (this.axis === "+X") this.position.x += 1;
      if (this.axis === "-X") this.position.x -= 1;
      if (this.axis === "+Y") this.position.y += 1;
      if (this.axis === "-Y") this.position.y -= 1;

      this.game.ai.tanks.forEach(bot => {
        //if (bot.reward === 0) bot.reward = calculateReward(bot);
      });
      count -= 1;
    }
    //clear fire from mem if it goes offscreen
    this.clearFromMem();
  }

  clearFromMem() {
    if (
      this.position.x < 0 ||
      this.position.y < 0 ||
      this.position.x > this.screenX ||
      this.position.y > this.screenY
    )
      this.lifeEnd();
  }

  lifeEnd() {
    this.life = 0;
  }
}
