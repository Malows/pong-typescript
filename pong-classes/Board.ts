import Drawable from './Drawable';
import Bar from './Bar';
import Ball from './Ball';

export default class Board {
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