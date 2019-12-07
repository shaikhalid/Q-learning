export function detectCollision(obj1, obj2) {
  let obj1Top = obj1.position.y;
  let obj1Left = obj1.position.x;
  let obj1Right = obj1.position.x + obj1.width;
  let obj1Bottom = obj1.position.y + obj1.height;

  //console.log(obj2);

  let obj2Top = obj2.position.y;
  let obj2Left = obj2.position.x;
  let obj2Right = obj2.position.x + obj2.width;
  let obj2Bottom = obj2.position.y + obj2.height;

  function intersect() {
    let aLeftOfB = obj1Right < obj2Left;
    let aRightOfB = obj1Left > obj2Right;
    let aAboveB = obj1Bottom < obj2Top;
    let aBelowB = obj1Top > obj2Bottom;

    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
  }

  // function valueInRange(value, min, max) {
  //   return value <= max && value >= min;
  // }

  // function rectOverlap() {
  //   let xOverlap =
  //     valueInRange(obj1Left, obj2Left, obj2Right) ||
  //     valueInRange(obj2Left, obj1Left, obj1Right);
  //   let yOverlap =
  //     valueInRange(obj1Top, obj2Top, obj2Bottom) ||
  //     valueInRange(obj2Top, obj1Top, obj1Bottom);
  //   return xOverlap && yOverlap;
  // }

  if (intersect()) {
    //console.log("hit");
    return true;
  } else {
    return false;
  }
}
