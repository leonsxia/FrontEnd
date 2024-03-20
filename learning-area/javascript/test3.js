const personPrototype = {
    greet() {
        console.log(`你好，我的名字是 ${this.name}！`);
    },

    age: 17
};

function Person(name) {
    this.name = name;
    this.OtherStuff = function () {
        console.log('other stuff.');
    }
}

Person.prototype.age = 17;
Person.prototype.greet = function() {
    console.log(`你好，我的名字是 ${this.name}！`);
}

// Object.assign(Person.prototype, personPrototype);

const reuben = new Person("Reuben");
reuben.greet();
reuben.OtherStuff();
reuben.__proto__.age = 27;
console.log(reuben.age);

const leon = new Person("Leon");
console.log(leon.age);