class Drawable {
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


class Ball extends Drawable {
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
    this.speed_y = 1;
    this.speed_x = this.speed/2;
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

class Bar extends Drawable {
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
}

class Board {
  width: number;
  height: number;
  playing: boolean;
  game_over: boolean;
  bars: Drawable[];
  ball: Ball;

  constructor(width: number,  height: number) {
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;    
  }

  public agregarBar( bar: Bar ) : void {
    this.bars.push( bar );
  }

  public agregarBall( ball: Ball ) : void {
    this.ball = ball;
  }

  public terminarJuego () :void {
    this.game_over = true;
    this.playing = false;
  }

  public drawableElements(): Drawable[] {
    var retorno = this.bars.map(function (params:Drawable) { return params });
    retorno.push( this.ball );
    return retorno;
  }
}

class BoardView {
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
      this.check_collisions();
      this.render();
    }
  }

  private check_collisions () : void {
    for (var barra = 0; barra < this.board.bars.length; barra++) {
      var element = this.board.bars[barra];
      if ( this.hit( element, this.board.ball )) {
        this.board.ball.barCollision( element );
      }
    }
  }

  private hit( a : Drawable, b : Drawable ) : boolean {
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

var board = new Board( window.innerWidth-20 , 500);
var bar1 = new Bar( 5, 100, 40, 100, board );
var bar2 = new Bar( window.innerWidth-65, 350, 40, 100, board ); 
var ball = new Ball( 400, 250, 10, board ); 
var canvas = document.getElementById('canvas');
var board_view = new BoardView( canvas, board );

var keys : boolean[] = [];

var onKeyDown_handler = function ( e:any ) : void {
  keys[ e.keyCode ] = true;
  if ( keys[38] )
    bar2.up();
  if ( keys[40] )
    bar2.down();
  if ( keys[81] )
    bar1.up();
  if ( keys[65] )
    bar1.down();
   if ( keys[80] )
    board.playing = !board.playing;
}

var onKeyUp_handler = function ( e:any ) : void {
  keys[ e.keyCode ] = false;
}

document.addEventListener( "keydown", onKeyDown_handler, false );
document.addEventListener( "keyup", onKeyUp_handler, false );
board_view.render();
window.requestAnimationFrame( controller );
document.addEventListener("load", controller );

function draw (contexto: any, elemento: Drawable) :void {
    switch( elemento.kind ) {
    case "rectangle":
      contexto.fillRect( elemento.x, elemento.y, elemento.width, elemento.height );
      break;
    case "circle":
      contexto.beginPath();
      contexto.arc( elemento.x, elemento.y, elemento.radius, 0, 7 );
      contexto.fill();
      contexto.closePath();
      break;
  }
}

function controller () {
  board_view.play();
  window.requestAnimationFrame( controller );
}