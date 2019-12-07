export function calculateReward(bot) {
  ////   TO BE TREATED AS BLACK BOX  ---v
  //calculating reward

  //initial reward 0 if survived
  let reward = bot.game.ai.REWARDS.SURVIVED;

  //aitank towards tank --> reward = 1
  if (
    bot.oldxOffset - bot.xOffsetFromTank < 0 ||
    bot.oldyOffset - bot.yOffsetFromTank < 0
    // Math.sqrt(
    //   bot.xOffsetFromTank * bot.xOffsetFromTank +
    //     bot.yOffsetFromTank * bot.yOffsetFromTank
    // ) >
    // Math.sqrt(bot.oldxOffset * bot.oldxOffset + bot.oldyOffset * bot.oldyOffset)
  ) {
    // console.log(
    //   [bot.oldxOffset, bot.xOffsetFromTank],
    //   [bot.oldyOffset, bot.yOffsetFromTank]
    // );
    reward = bot.game.ai.REWARDS.FARTHER;
  }
  if (
    Math.sqrt(
      bot.xOffsetFromTank * bot.xOffsetFromTank +
        bot.yOffsetFromTank * bot.yOffsetFromTank
    ) <
    Math.sqrt(bot.oldxOffset * bot.oldxOffset + bot.oldyOffset * bot.oldyOffset)
  ) {
    // console.log(
    //   [bot.oldxOffset, bot.xOffsetFromTank],
    //   [bot.oldyOffset, bot.yOffsetFromTank]
    // );
    reward = bot.game.ai.REWARDS.CLOSER;
    //return reward;
  }

  // aitank drive into wall --> reward = -1
  if (bot.noUpdate) {
    reward = bot.game.ai.REWARDS.DRIVE_INTO_WALL;
  }

  // don't stop muthafucka
  if (
    bot.oldxOffset === bot.xOffsetFromTank &&
    bot.oldyOffset === bot.yOffsetFromTank
  ) {
    if (bot.waitTime > 300) {
      bot.waitTime = 0;
      reward = bot.game.ai.REWARDS.IDLE;
    }
    bot.waitTime += 1;
  }

  //fire + aitank  -->  reward = -1
  bot.game.tank.fires.forEach(fire => {
    //console.log(fire.position, bot.position);

    if (fire.axis === "+Y" || fire.axis === "-Y")
      if (
        bot.position.x <= fire.position.x &&
        fire.position.x <= bot.position.x + bot.width
      ) {
        if (
          (fire.axis === "+Y" &&
            fire.position.y <= bot.position.y + bot.height) ||
          (fire.axis === "-Y" && fire.position.y >= bot.position.y)
        ) {
          reward = bot.game.ai.REWARDS.GET_HIT;
          //return reward;
        }
      }

    if (fire.axis === "+X" || fire.axis === "-X")
      if (
        bot.position.y <= fire.position.y &&
        fire.position.y <= bot.position.y + bot.height
      ) {
        if (
          (fire.axis === "+X" &&
            fire.position.x <= bot.position.x + bot.width) ||
          (fire.axis === "-X" && fire.position.x >= bot.position.x)
        ) {
          reward = bot.game.ai.REWARDS.GET_HIT;
          //return reward;
        }
      }
  });

  //aifire + tank  -->  reward = 1
  bot.fires.forEach(fire => {
    if (fire.axis === "+Y" || fire.axis === "-Y")
      if (
        bot.game.tank.position.x <= fire.position.x &&
        fire.position.x <= bot.game.tank.position.x + bot.game.tank.width
      )
        if (
          (fire.axis === "+Y" &&
            fire.position.y <=
              bot.game.tank.position.y + bot.game.tank.height) ||
          (fire.axis === "-Y" && fire.position.y >= bot.game.tank.position.y)
        ) {
          reward = bot.game.ai.REWARDS.HIT_TANK;
          //return reward;
        }

    if (fire.axis === "+X" || fire.axis === "-X")
      if (
        bot.game.tank.position.y <= fire.position.y &&
        fire.position.y <= bot.game.tank.position.y + bot.game.tank.height
      )
        if (
          (fire.axis === "+X" &&
            fire.position.x <=
              bot.game.tank.position.x + bot.game.tank.height) ||
          (fire.axis === "-X" && fire.position.x >= bot.game.tank.position.x)
        ) {
          reward = bot.game.ai.REWARDS.HIT_TANK;
          //return reward;
        }
  });

  //stop wasting bullets
  bot.fires.forEach(fire => {
    // console.log(
    //   [fire.position.x, fire.position.y],
    //   [bot.game.gameWidth, bot.game.gameHeight],
    //   bot.game.blockSize
    // );
    // console.log([
    //   fire.position.x + fire.vel > bot.game.gameWidth - bot.game.blockSize,
    //   fire.position.x - fire.vel < bot.game.blockSize,
    //   fire.position.y + fire.vel > bot.game.gameHeight - bot.game.blockSize,
    //   fire.position.y - fire.vel < bot.game.blockSize
    // ]);

    if (
      fire.position.x + fire.vel > bot.game.gameWidth - bot.game.blockSize ||
      fire.position.x - fire.vel < bot.game.blockSize ||
      fire.position.y + fire.vel > bot.game.gameHeight - bot.game.blockSize ||
      fire.position.y - fire.vel < bot.game.blockSize
    ) {
      reward = bot.game.ai.REWARDS.BULLET_WASTED;
    }
  });

  //aifire + aitank  -->  reward = 1
  bot.fires.forEach(fire => {
    bot.game.ai.tanks.forEach(aitank2 => {
      if (aitank2 !== bot) {
        if (fire.axis === "+Y" || fire.axis === "-Y")
          if (
            aitank2.position.x <= fire.position.x &&
            fire.position.x <= aitank2.position.x + aitank2.width
          )
            if (
              (fire.axis === "+Y" &&
                fire.position.y <= aitank2.position.y + aitank2.height) ||
              (fire.axis === "-Y" && fire.position.y >= aitank2.position.y)
            ) {
              reward = bot.game.ai.REWARDS.HIT_TANK;
              //return reward;
            }

        if (fire.axis === "+X" || fire.axis === "-X")
          if (
            aitank2.position.y <= fire.position.y &&
            fire.position.y <= aitank2.position.y + aitank2.height
          )
            if (
              (fire.axis === "+X" &&
                fire.position.x <= aitank2.position.x + aitank2.width) ||
              (fire.axis === "-X" && fire.position.x >= aitank2.position.x)
            ) {
              reward = bot.game.ai.REWARDS.HIT_TANK;
              //return reward;
            }
      }
    });
  });

  return reward;
} ////  ^--------- TO BE TREATED AS BLACK BOX
