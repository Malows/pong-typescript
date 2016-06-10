export default class Drawable {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number; 
  speed: number;
  kind: string;
  constructor(x: number, y: number, width: number, height: number ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.radius = 0;
    this.speed = 1;
    this.kind = "";
  }

  move () :void {}

}
