export function state(bot) {
  let x;
  let y;

  let xdiff = bot.position.x % bot.game.blockSize;
  let ydiff = bot.position.y % bot.game.blockSize;

  x =
    xdiff < bot.game.blockSize / 2
      ? bot.position.x - xdiff
      : bot.position.x + bot.game.blockSize - xdiff;

  y =
    ydiff < bot.game.blockSize / 2
      ? bot.position.y - ydiff
      : bot.position.y + bot.game.blockSize - ydiff;

  return [x, y];
}
