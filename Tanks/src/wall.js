export default class Wall {
  constructor(game, x, y) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.width = game.blockSize;
    this.height = game.blockSize;

    this.position = {
      x: x,
      y: y
    };
  }

  draw(ctx) {
    ctx.fillStyle = "#555";
    if (this.height > 0 && this.width > 0)
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  reduce(axis) {
    if (axis === "+X") this.reduceLeft();
    if (axis === "-X") this.reduceWidth();
    if (axis === "+Y") this.reduceTop();
    if (axis === "-Y") this.reduceHeight();
  }

  reduceHeight() {
    this.height -= 20;
  }
  reduceWidth() {
    this.width -= 20;
  }
  reduceLeft() {
    this.position.x += 20;
    this.width -= 20;
  }
  reduceTop() {
    this.position.y += 20;
    this.height -= 20;
  }
}
