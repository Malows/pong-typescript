import Board from './Board';
import Drawable from './Drawable';
import { draw } from './pong';

export default class BoardView {
  canvas: any;
  board: Board;
  contexto: any;
  constructor( canvas: HTMLElement, board: Board){
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.contexto = this.canvas.getContext("2d");
  }

  private draw () :void {
    var elementosDibujables = this.board.drawableElements();
    for (var i = 0; i < elementosDibujables.length; i++) {
      var element = elementosDibujables[i];
      draw( this.contexto, element );
    }
  }

  private clean () : void {
    this.contexto.clearRect( 0, 0, this.board.width, this.board.height );
  }
  
  public render () : void {
    this.clean();
    this.draw();
    this.board.ball.move();
  }

  public play () : void {
    if ( this.board.playing ) {
      this.render();
    }
  }

  check_collisions () : void {
    for (var barra = 0; barra < this.board.bars.length; barra++) {
      var element = this.board.bars[barra];
      if ( this.hit( element, this.board.ball )) {
        this.board.ball.barCollision( element );
      }
    }
  }

  hit( a : Drawable, b : Drawable ) : boolean {
    //Revisa si a colisiona con b
    //Colsiones horizontales
    if ( b.x + b.width >= a.x && b.x < a.x + a.width ) {
        //Colisiones verticales
        if ( b.y + b.height >= a.y && b.y < a.y + a.height ) {
            return true;
        }
    }
    //Colisión de a con b
    if ( b.x <= a.x && b.x + b.width >= a.x + a.width) {
        if ( b.y <= a.y && b.y + b.height >= a.y + a.height ) {
            return true;
        }
    }
    //Colisión b con a
    if ( a.x <= b.x && a.x + a.width >= b.x + b.width ) {
        if ( a.y <= b.y && a.y + a.height >= b.y + b.height ) {
            return true;
        }
    }
    return false;
  }
}
