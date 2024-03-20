function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

// 定义 Ball 构造器，继承自 Shape

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
}

// Ball.prototype = Object.create(Shape.prototype);
// Ball.prototype.constructor = Ball;
// Object.setPrototypeOf(Ball.prototype, Shape.prototype);
Ball.prototype.__proto__ = Shape.prototype;

let ball = new Ball(10, 20, 5, 5, true, 'rgb(12, 18, 20)', 10);
// ball ---> Ball.prototype ---> Shape.prototype ---> Object.prototype ---> null
console.log(ball);