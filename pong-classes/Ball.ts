import Drawable from './Drawable';
import Board from './Board';

export default class Ball extends Drawable {
  board: Board;
  speed_x: number;
  speed_y: number;
  direction_x: number;
  direction_y: number;
  radius: number;
  bounce_angle: number;
  max_bounce_angle: number;

  constructor(x: number, y: number, radius: number,  board : Board ) {
    super( x, y, radius*2, radius*2 );
    this.board = board;
    this.radius = radius;

    this.direction_x = 1;
    this.direction_y = 1;

    this.kind = "circle";
    this.speed = 10;
    this.speed_x = this.speed_y = this.speed/2;
    this.bounce_angle = 0;
    this.max_bounce_angle = Math.PI / 12;
    this.board.agregarBall( this );
  }
  
  barCollision ( bar : Drawable ) : void {
    var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;
    var normalized_intersect_y = relative_intersect_y / (bar.height / 2);
    this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
    this.speed_y = this.speed * -Math.sin(this.bounce_angle);
    this.speed_x = this.speed * Math.cos(this.bounce_angle);
    if(this.x > (this.board.width / 2)) {
      this.direction_x = -1;
    } else {
      this.direction_x = 1;
    }
  }
  
  wallCollision () : void {
      if ( (this.y <= this.radius ) || (this.y >= (this.board.height - this.radius)) ) {
      this.bounce_angle = this.bounce_angle * (-1);
      this.direction_y = -(this.direction_y);
    }
  }

  private vertical ( direction : number ) : void {
    this.y += ( this.speed_y * direction );
  }

  private horizontal ( direction : number ) : void {
    this.x += ( this.speed_x * direction );
  }

  public move () : void {
    this.vertical( this.direction_y );
    this.horizontal( this.direction_x );
  }


}