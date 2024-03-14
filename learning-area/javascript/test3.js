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

Object.assign(Person.prototype, personPrototype);

const reuben = new Person("Reuben");
reuben.greet();
reuben.OtherStuff();