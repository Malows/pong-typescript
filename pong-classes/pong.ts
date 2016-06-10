import Drawable from './Drawable';
import Ball from './Ball';
import Bar from './Bar';
import Board from './Board';
import BoardView from './BoardView';

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

export function draw (contexto: any, elemento: Drawable) :void {
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
