
var cities = ['lonDon', 'ManCHESTer', 'BiRmiNGHAM', 'liVERpoOL'];
var a = 0;
a++;
for(var i = 0; i < cities.length; i++) {
  var input = cities[i];
  // write your code just below here
  input = input.toLowerCase();
  input = input.replace(input[0], input[0].toUpperCase());
  var result = input;
  console.log(result);
}
console.log(i);