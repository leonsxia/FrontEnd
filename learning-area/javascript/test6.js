const numbers = [];
const obj = { a: 1, b: 2 };
({ a: numbers[0], b: numbers[1] } = obj);

let testObj = {name: 'test'};
const original = new Map([[1, testObj]]);

const clone = new Map(original);

console.log(clone.get(1).name); // one
testObj.name = 'other';
console.log(clone.get(1).name); // one
console.log(original === clone);
console.log(Object.is(original, clone));