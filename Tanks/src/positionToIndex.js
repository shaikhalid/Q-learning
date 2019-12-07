const blockSize = 40; //------------------------------DO NOT MISS WHEN UPDATING VERY IMPORTANT

export function positionToIndex(positions) {
  // arr[0] = arr[0] / this.game.blockSize;
  // arr[1] = arr[1] / this.game.blockSize;

  let indexes = [];
  positions.forEach(elem => {
    indexes.push(elem / blockSize);
  });

  return indexes;
}

export function coordinateToIndex(coordinate) {
  let diff = coordinate % blockSize;

  let newCoordinate =
    diff < blockSize / 2 ? coordinate - diff : coordinate + blockSize - diff;

  return newCoordinate / blockSize;
}

export function gridCoordinateOf(coordinate) {
  let diff = coordinate % blockSize;

  let newCoordinate =
    diff < blockSize / 2 ? coordinate - diff : coordinate + blockSize - diff;

  return newCoordinate;
}
