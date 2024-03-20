function Base() {}
function Derived() {}
// 将 `Derived.prototype` 的 `[[Prototype]]`
// 设置为 `Base.prototype`
Object.setPrototypeOf(Derived.prototype, Base.prototype);

const obj = new Derived();
// obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null

console.log(obj);