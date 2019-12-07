import { detectCollision } from "./collisionDetection.js";
import { calculateReward } from "./calculateReward.js";

export default class Collision {
  constructor(game) {
    this.game = game;
    this.tank = game.tank;
    this.ai = game.ai;
    this.terrain = game.terrain;
  }

  axisOfCollision(tank, box) {
    //                ^----------  (moving obj, stationary obj)
    let boxTop = box.position.y;
    let boxLeft = box.position.x;
    let boxRight = box.position.x + box.width;
    let boxBottom = box.position.y + box.height;

    //console.log(obj2);

    let tankTop = tank.position.y;
    let tankLeft = tank.position.x;
    let tankRight = tank.position.x + tank.width;
    let tankBottom = tank.position.y + tank.height;

    if (tankTop === boxBottom) {
      if (tank.velY === -1) {
        if (
          (tankRight <= boxRight && tankLeft >= boxLeft) ||
          (tankLeft < boxLeft && tankRight > boxLeft) ||
          (tankRight > boxRight && tankLeft < boxRight)
        )
          return "^";
      } //else return 0;
    }
    if (tankRight === boxLeft) {
      if (tank.velX === 1) {
        if (
          (tankBottom <= boxBottom && tankTop >= boxTop) ||
          (tankTop < boxTop && tankBottom > boxTop) ||
          (tankBottom > boxBottom && tankTop < boxBottom)
        )
          return ">";
      } //else return 0;
    }
    if (tankBottom === boxTop) {
      if (tank.velY === 1) {
        if (
          (tankRight <= boxRight && tankLeft >= boxLeft) ||
          (tankLeft < boxLeft && tankRight > boxLeft) ||
          (tankRight > boxRight && tankLeft < boxRight)
        )
          return "v";
      } // else return 0;
    }
    if (tankLeft === boxRight) {
      if (tank.velX === -1) {
        if (
          (tankBottom <= boxBottom && tankTop >= boxTop) ||
          (tankTop < boxTop && tankBottom > boxTop) ||
          (tankBottom > boxBottom && tankTop < boxBottom)
        )
          return "<";
      } //else return 0;
    }
    return 0;
  }

  check() {
    if (this.game.gamestate === 1) this.update();
    else {
      //console.log("high cpu for some fukn reason");   //it's fixed now
      return;
    }
  }

  update() {
    this.game.ai.tanks.forEach(bot => {
      calculateReward(bot);
    });

    //aitank + boundary
    this.ai.tanks.forEach(aitank => {
      if (aitank.position.x < 0) aitank.position.x = 0;
      if (aitank.position.y < 0) aitank.position.y = 0;
      if (aitank.position.x + aitank.width > this.game.gameWidth)
        aitank.position.x = this.game.gameWidth - aitank.width;
      if (aitank.position.y + aitank.height > this.game.gameHeight)
        aitank.position.y = this.game.gameHeight - aitank.height;
    });

    //tank + aitank
    if (this.ai.tanks !== undefined) {
      this.ai.tanks.forEach(aitank => {
        if (detectCollision(this.tank, aitank)) {
          if (this.axisOfCollision(this.tank, aitank)) this.tank.noUpdate = 1;
          if (this.axisOfCollision(aitank, this.tank)) aitank.noUpdate = 1;
        }
      });
    }

    //tank + wall
    if (this.terrain.walls !== undefined) {
      this.terrain.walls.forEach(wall => {
        if (detectCollision(this.tank, wall)) {
          let axis = this.axisOfCollision(this.tank, wall);
          //if (axis === 0) console.log(axis);
          if (axis === "^" || axis === ">" || axis === "v" || axis === "<") {
            this.tank.noUpdate = 1;
            //return true;
          }
        }
      });
    }

    //fire + wall
    if (this.terrain.walls && this.tank.fires.length) {
      this.terrain.walls.forEach(wall => {
        this.tank.fires.forEach(fire => {
          if (detectCollision(fire, wall)) {
            //console.log("wall hit");
            fire.lifeEnd();
            wall.reduce(fire.axis);
          }
        });
      });
      this.terrain.removeEmpty();
    }

    //fire + aitank
    if (this.ai.tanks && this.tank.fires.length) {
      this.ai.tanks.forEach(tank => {
        this.tank.fires.forEach(fire => {
          if (detectCollision(fire, tank)) {
            //console.log("opp hit");
            fire.lifeEnd();
            tank.lifeEnd();
          }
        });
      });
      this.ai.removeEmpty();
    }

    //aitank + wall
    if (this.ai.tanks) {
      this.ai.tanks.forEach(aitank => {
        if (this.terrain.walls) {
          this.terrain.walls.forEach(wall => {
            if (detectCollision(aitank, wall)) {
              let axis = this.axisOfCollision(aitank, wall);
              //console.log(axis);
              if (
                (axis === "^" && aitank.axis === "-Y") ||
                (axis === ">" && aitank.axis === "+X") ||
                (axis === "v" && aitank.axis === "+Y") ||
                (axis === "<" && aitank.axis === "-X")
              ) {
                aitank.noUpdate = 1;
              }
            }
          });
        }
      });
    }

    //aifire + wall
    if (this.terrain.walls) {
      this.terrain.walls.forEach(wall => {
        this.ai.tanks.forEach(aitank => {
          aitank.fires.forEach(fire => {
            if (detectCollision(fire, wall)) {
              //console.log("wall hit");
              fire.lifeEnd();
              wall.reduce(fire.axis);
              //aitank.reward = 1;
            }
          });
        });
      });
      this.terrain.removeEmpty();
    }

    //aifire + tank
    this.ai.tanks.forEach(aitank => {
      aitank.fires.forEach(fire => {
        if (detectCollision(fire, this.tank)) {
          fire.lifeEnd();
          this.game.loseLife();
          //this.tank.respawn();
        }
      });
    });

    //aifire + aitank
    this.ai.tanks.forEach(aitank => {
      aitank.fires.forEach(fire => {
        this.ai.tanks.forEach(aitank2 => {
          if (aitank !== aitank2 && detectCollision(fire, aitank2)) {
            fire.lifeEnd();
            aitank2.lifeEnd();
          }
        });
      });
    });

    //aitank + aitank
    this.ai.tanks.forEach(aitank => {
      this.ai.tanks.forEach(aitank2 => {
        if (aitank !== aitank2 && detectCollision(aitank, aitank2)) {
          // let axis = this.axisOfCollision(aitank, aitank2);
          // if (
          //   (axis === "^" && aitank.axis === "-Y") ||
          //   (axis === ">" && aitank.axis === "+X") ||
          //   (axis === "v" && aitank.axis === "+Y") ||
          //   (axis === "<" && aitank.axis === "-X")
          // ) {
          //   aitank.noUpdate = 1;
          //   aitank2.noUpdate = 1;
          // }
          if (this.axisOfCollision(aitank, aitank2)) aitank.noUpdate = 1;
          if (this.axisOfCollision(aitank2, aitank)) aitank2.noUpdate = 1;
        }
      });
    });
  }
}
