const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(0,0,0)';
// ctx.fillRect(0, 0, width, height);

ctx.translate(width / 2, height / 2);
ctx.fillRect(-(width / 2), -(height / 2), width, height);
ctx.strokeStyle = 'rgb(0, 255, 0)';
ctx.beginPath();
ctx.moveTo(-(width / 2), 74);
ctx.lineTo(width / 2, 74);
ctx.stroke();

// rectangle
// ctx.fillStyle = 'rgb(255, 0, 0)';
// ctx.fillRect(50, 50, 100, 150);

// ctx.fillStyle = 'rgb(0, 255, 0)';
// ctx.fillRect(75, 75, 100, 100);

// ctx.strokeStyle = 'rgba(255, 0, 255, 0.75)';
// ctx.strokeRect(25, 100, 175, 50);

// ctx.strokeStyle = 'rgb(255, 255, 255)';
// ctx.strokeRect(25, 25, 175, 200);
// ctx.lineWidth = 5;


// paths
// function degToRad(degrees) {
//     return (degrees * Math.PI) / 180;
// }

// ctx.fillStyle = "rgb(255, 0, 0)";
// ctx.beginPath();
// ctx.moveTo(50, 50);

// ctx.lineTo(150, 50);
// var triHeight = 50 * Math.tan(degToRad(60));
// ctx.lineTo(100, 50 + triHeight);
// ctx.lineTo(50, 50);
// ctx.fill();

// ctx.fillStyle = 'rgb(0, 0, 255)';
// ctx.beginPath();
// ctx.arc(150, 106, 50, degToRad(0), degToRad(360), false);
// ctx.fill();

// ctx.fillStyle = 'yellow';
// ctx.beginPath();
// ctx.arc(200, 106, 50, degToRad(-45), degToRad(45), true);
// ctx.lineTo(200, 106);
// ctx.fill();

// text
ctx.strokeStyle = "white";
ctx.lineWidth = 1;
ctx.font = "36px arial";
ctx.strokeText("Canvas text", 50, 50);

// ctx.fillStyle = "red";
// ctx.font = "48px georgia";
// ctx.fillText("Canvas text", 50, 150);

// image
// var image = new Image();
// image.src = "firefox.png";
// // image.onload = () => ctx.drawImage(image, 50, 50);
// image.onload = () => ctx.drawImage(image, 20, 20, 185, 175, 50, 50, 185, 175);

// for loop
// ctx.translate(width / 2, height / 2);

// function degToRad(degrees) {
//     return (degrees * Math.PI) / 180;
// }

// function rand(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// let length = 250;
// let moveOffset = 20;

// var image = new Image();
// image.src = "firefox.png";

// image.onload = () => {
//     for (var i = 0; i < length; i++) {
//         ctx.drawImage(image, 20, 20, 185, 175, moveOffset, moveOffset, length, length);
//         length--;
//         moveOffset += 0.7;
//         ctx.rotate(degToRad(5));
//     }
// };
// for (var i = 0; i < length; i++) {
//     ctx.fillStyle = `rgba(${255-length},0,${255-length},0.9)`;
//     ctx.beginPath();
//     // ctx.moveTo(moveOffset, moveOffset);
//     // ctx.lineTo(moveOffset + length, moveOffset);
//     // var triHeight = (length / 2) * Math.tan(degToRad(60));
//     // ctx.lineTo(moveOffset + length / 2, moveOffset + triHeight);
//     // ctx.lineTo(moveOffset, moveOffset);
//     // ctx.fill();
//     // ctx.fillRect(moveOffset, moveOffset, length, length);
//     // ctx.arc(moveOffset, moveOffset, length, degToRad(-45), degToRad(45), true);
//     // ctx.lineTo(moveOffset, moveOffset);
//     // ctx.fill();

//     length--;
//     moveOffset += 0.7;
//     ctx.rotate(degToRad(5));
// }