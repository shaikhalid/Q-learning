import Wall from "./wall.js";

export default class Terrain {
  constructor(game) {
    this.game = game;
    this.blockSize = game.blockSize;

    this.walls = [];
  }

  clear() {
    if (this.walls !== undefined) this.walls.splice(0, this.walls.length);
  }

  // buildBoundary() {
  //   for (let i = -1; i < 21; i++) {
  //     new Wall(this.game, this.blockSize * i, this.blockSize * -1);
  //   }
  //   for (let i = -1; i < 21; i++) {
  //     new Wall(this.game, this.blockSize * i, this.blockSize * 16);
  //   }
  //   for (let i = 0; i < 16; i++) {
  //     new Wall(this.game, this.blockSize * -1, this.blockSize * i);
  //   }
  //   for (let i = 0; i < 16; i++) {
  //     new Wall(this.game, this.blockSize * 20, this.blockSize * i);
  //   }
  // }

  buildWalls() {
    this.clear();

    let level = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    level.forEach(row => {
      let y = level.indexOf(row);
      for (let i = 0; i < row.length; i++) {
        if (row[i]) {
          this.walls.push(
            new Wall(this.game, this.blockSize * i, this.blockSize * y)
          );
        }
      }
    });
  }

  removeEmpty() {
    this.walls.forEach(wall => {
      if (wall.height <= 0 || wall.width <= 0) {
        this.walls.splice(this.walls.indexOf(wall), 1);
      }
    });
  }

  draw(ctx) {
    this.walls.forEach(wall => wall.draw(ctx));
  }
}
