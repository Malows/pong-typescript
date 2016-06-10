import Drawable from './Drawable';
import Board from './Board';

export default class Bar extends Drawable {
  board: Board;
  constructor(x: number, y: number, width: number, height: number, board : Board ) {
    super( x, y, width, height );
    this.board = board;
    this.speed = 10;
    this.kind = "rectangle";
    this.board.agregarBar( this );
  }
  
  up () : void {
    this.y -= this.speed;
  }

  down () : void {
    this.y += this.speed;
  }

  toString () : string {
    return "x: " + this.x + ", y: " + this.y;
  }
}