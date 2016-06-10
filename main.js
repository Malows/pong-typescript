var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Drawable = (function () {
    function Drawable(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radius = 0;
        this.speed = 1;
        this.kind = "";
    }
    Drawable.prototype.move = function () { };
    return Drawable;
}());
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(x, y, radius, board) {
        _super.call(this, x, y, radius * 2, radius * 2);
        this.board = board;
        this.radius = radius;
        this.direction_x = 1;
        this.direction_y = 1;
        this.kind = "circle";
        this.speed = 10;
        this.speed_y = 1;
        this.speed_x = this.speed / 2;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.board.agregarBall(this);
    }
    Ball.prototype.barCollision = function (bar) {
        var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
        var normalized_intersect_y = relative_intersect_y / (bar.height / 2);
        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);
        if (this.x > (this.board.width / 2)) {
            this.direction_x = -1;
        }
        else {
            this.direction_x = 1;
        }
    };
    Ball.prototype.wallCollision = function () {
    };
    Ball.prototype.vertical = function (direction) {
        this.y += (this.speed_y * direction);
    };
    Ball.prototype.horizontal = function (direction) {
        this.x += (this.speed_x * direction);
    };
    Ball.prototype.move = function () {
        this.vertical(this.direction_y);
        this.horizontal(this.direction_x);
    };
    return Ball;
}(Drawable));
var Bar = (function (_super) {
    __extends(Bar, _super);
    function Bar(x, y, width, height, board) {
        _super.call(this, x, y, width, height);
        this.board = board;
        this.speed = 10;
        this.kind = "rectangle";
        this.board.agregarBar(this);
    }
    Bar.prototype.up = function () {
        this.y -= this.speed;
    };
    Bar.prototype.down = function () {
        this.y += this.speed;
    };
    return Bar;
}(Drawable));
var Board = (function () {
    function Board(width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }
    Board.prototype.agregarBar = function (bar) {
        this.bars.push(bar);
    };
    Board.prototype.agregarBall = function (ball) {
        this.ball = ball;
    };
    Board.prototype.terminarJuego = function () {
        this.game_over = true;
        this.playing = false;
    };
    Board.prototype.drawableElements = function () {
        var retorno = this.bars.map(function (params) { return params; });
        retorno.push(this.ball);
        return retorno;
    };
    return Board;
}());
var BoardView = (function () {
    function BoardView(canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.contexto = this.canvas.getContext("2d");
    }
    BoardView.prototype.draw = function () {
        var elementosDibujables = this.board.drawableElements();
        for (var i = 0; i < elementosDibujables.length; i++) {
            var element = elementosDibujables[i];
            draw(this.contexto, element);
        }
    };
    BoardView.prototype.clean = function () {
        this.contexto.clearRect(0, 0, this.board.width, this.board.height);
    };
    BoardView.prototype.render = function () {
        this.clean();
        this.draw();
        this.board.ball.move();
    };
    BoardView.prototype.play = function () {
        if (this.board.playing) {
            this.check_collisions();
            this.render();
        }
    };
    BoardView.prototype.check_collisions = function () {
        for (var barra = 0; barra < this.board.bars.length; barra++) {
            var element = this.board.bars[barra];
            if (this.hit(element, this.board.ball)) {
                this.board.ball.barCollision(element);
            }
        }
    };
    BoardView.prototype.hit = function (a, b) {
        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            if (b.y + b.height >= a.y && b.y < a.y + a.height) {
                return true;
            }
        }
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                return true;
            }
        }
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
                return true;
            }
        }
        return false;
    };
    return BoardView;
}());
var board = new Board(window.innerWidth - 20, 500);
var bar1 = new Bar(5, 100, 40, 100, board);
var bar2 = new Bar(window.innerWidth - 65, 350, 40, 100, board);
var ball = new Ball(400, 250, 10, board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var keys = [];
var onKeyDown_handler = function (e) {
    keys[e.keyCode] = true;
    if (keys[38])
        bar2.up();
    if (keys[40])
        bar2.down();
    if (keys[81])
        bar1.up();
    if (keys[65])
        bar1.down();
    if (keys[80])
        board.playing = !board.playing;
};
var onKeyUp_handler = function (e) {
    keys[e.keyCode] = false;
};
document.addEventListener("keydown", onKeyDown_handler, false);
document.addEventListener("keyup", onKeyUp_handler, false);
board_view.render();
window.requestAnimationFrame(controller);
document.addEventListener("load", controller);
function draw(contexto, elemento) {
    switch (elemento.kind) {
        case "rectangle":
            contexto.fillRect(elemento.x, elemento.y, elemento.width, elemento.height);
            break;
        case "circle":
            contexto.beginPath();
            contexto.arc(elemento.x, elemento.y, elemento.radius, 0, 7);
            contexto.fill();
            contexto.closePath();
            break;
    }
}
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}
