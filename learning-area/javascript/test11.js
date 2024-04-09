function varTest() {
  var x = 1;
  {
    var x = 2; // 同一个变量！
    console.log(x); // 2
  }
  console.log(x); // 2
}

function letTest() {
  let x = 1;
  {
    let x = 2; // 不同的变量
    console.log(x); // 2
  }
  console.log(x); // 1
}

varTest();
letTest();