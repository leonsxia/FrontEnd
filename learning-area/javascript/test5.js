o = {};
// 等价于：
o = Object.create(Object.prototype);

o = Object.create(Object.prototype, {
    // foo 是一个常规数据属性
    foo: {
        writable: true,
        configurable: true,
        value: "hello",
    },
    // bar 是一个访问器属性
    bar: {
        configurable: false,
        get() {
            return 10;
        },
        set(value) {
            console.log("Setting `o.bar` to", value);
        },
    },
});

// 创建一个新对象，它的原型是一个新的空对象，并添加一个名为 'p'，值为 42 的属性。
o = Object.create({}, { p: { value: 42 } });