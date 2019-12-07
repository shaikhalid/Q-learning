import { calculateReward } from "./calculateReward.js";
import { updateConsole } from "./customConsole.js";

//Step functions
export function step(bot, action) {
  if (action === "pause") {
    return;
  } else {
    // if (bot.game.elapsedTime > bot.game.timeInterval) {
    if (action === "U") {
      bot.moveUp();
    }
    if (action === "D") {
      bot.moveDown();
    }
    if (action === "L") {
      bot.moveLeft();
    }
    if (action === "R") {
      bot.moveRight();
    }
    if (action === "1") {
      bot.shoot();
    }
    if (action === "-") {
      bot.stop();
    }
    if (action === "^") {
      bot.moveUp();
      bot.stop();
      bot.shoot();
    }
    if (action === ">") {
      bot.moveRight();
      bot.stop();
      bot.shoot();
    }
    if (action === "v") {
      bot.moveDown();
      bot.stop();
      bot.shoot();
    }
    if (action === "<") {
      bot.moveLeft();
      bot.stop();
      bot.shoot();
    }
    //bot.game.elapsedTime = 0;
    // }
    // bot.game.elapsedTime += 1;

    bot.reward = calculateReward(bot);
    let array = bot.game.currentState();
    //console.log(bot.reward, array);
    //console.log(action);

    //custom console
    updateConsole(bot, array);
    return [bot.reward, bot.game.currentState()];
  }
}

export function setSteps(bot, steps, adt) {
  this.steps = steps;
  this.callStepFunction(adt);
}

export function callStepFunction(bot, adt) {
  let currentTask = 0;
  let game = this.game;
  setInterval(function() {
    //console.log(this);

    if (
      game.gamestate === 0 ||
      game.gamestate === 2 ||
      game.gamestate === 3 ||
      game.gamestate === 5
    )
      return;

    if (currentTask >= bot.steps.length) currentTask = 0;

    if (bot.steps[currentTask] == "U") {
      bot.step("U");
    }
    if (bot.steps[currentTask] == "D") {
      bot.step("D");
    }
    if (bot.steps[currentTask] == "L") {
      bot.step("L");
    }
    if (bot.steps[currentTask] == "R") {
      bot.step("R");
    }
    if (bot.steps[currentTask] == "-") {
      bot.step("-");
    }
    if (bot.steps[currentTask] == "1") {
      bot.step("1");
    }

    currentTask += 1;
  }, adt);
}
