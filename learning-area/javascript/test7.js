const boxPrototype1 = {
    constructor: Box,
    a: 1
}

const boxPrototype2 = {
    constructor: Box,
    b: 2
}

function Box(x) {
    this.value = x; 
}

Box.prototype = boxPrototype1;
// Box.prototype.constructor = Box;
const box1 = new Box(1);
console.log(box1.a, box1.b);

Box.prototype = boxPrototype2;
const box2 = new Box(2);
console.log(box2.a, box2.b);