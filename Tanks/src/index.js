import Game from "./game.js";
import {} from "./fpsmeter.js";

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 640;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;

let fpsmeter = new FPSMeter({
  decimals: 0,
  graph: true,
  theme: "dark",
  left: "5px"
});

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  game.update(deltaTime);
  game.draw(ctx);

  fpsmeter.tickStart();
  fpsmeter.tick();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
