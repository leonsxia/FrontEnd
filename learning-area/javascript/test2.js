class Shape {

    name;
    sides;
    sideLength;

    constructor(name, sides, sideLength) {
        this.name = name;
        this.sides = sides;
        this.sideLength = sideLength;
    }

    calcPerimeter() {
        console.log(this.sides * this.sideLength);
    }
}

class Square extends Shape {
    #color;
    constructor(sideLength) {
        super('square', 4, sideLength);
        this.#color = 'red';
    }

    calcArea() {
        console.log(this.sideLength ** 2);
    }

    showColor() {
        console.log(this.#color);
    }
}

let triangle = new Shape('triangle', 3, 3);
let square = new Square(4);
triangle.calcPerimeter();
square.calcPerimeter();
square.calcArea();

