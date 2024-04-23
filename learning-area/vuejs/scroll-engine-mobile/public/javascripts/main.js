import { Obstacle } from './modules/obstacle.js';
import { Player } from './modules/player.js';
import { ScrollEngine } from './modules/scroll_engine.js';
import { Sandbox } from './modules/sandbox.js';

const canvas = document.querySelector('.myCanvas');
const width = canvas.width = 500;
const height = canvas.height = 500 * 9 / 16;
const ctx = canvas.getContext('2d');
const groundLevel = height / 4;
const centerLineX = 0;
const centerLeft = -10;
const centerRight = 10;
const leftScrollCenterFactor = 80;
const leftScrollLeft = - width / 2 + leftScrollCenterFactor - 10;
const leftScrollRight = - width / 2 + leftScrollCenterFactor + 10;
const invisibleLeft = - width / 2;  // - 200;
const invisibleRight = width / 2; //+ 200;

const fps = 60;
const msPerFrame = 1000 / fps; // 16.666666667
const velFactor = 60 / fps;

const scale = 0.5;

var debug = document.querySelector('#debug-info');
var debug2 = document.querySelector('#debug-info2');
debug.textContent = `width:${width} height:${height}`;
debug2.textContent = `window_width:${window.innerWidth} window_height:${window.innerHeight}`;

const config = {
    ctx: ctx,
    width: width,
    height: height,
    groundLevel: groundLevel,
    centerLineX: centerLineX,
    centerLeft: centerLeft,
    centerRight: centerRight,
    leftScrollCenterFactor: leftScrollCenterFactor,
    leftScrollLeft: leftScrollLeft,
    leftScrollRight: leftScrollRight,
    fps: fps,
    msPerFrame: msPerFrame,
    velFactor: velFactor,
    scale: scale
};

ctx.fillStyle = 'rgb(0,0,0)';
ctx.fillRect(0, 0, width, height);

ctx.translate(width / 2, 3 * height / 4);

let imageLeft = new Image();
let imageRight = new Image();
imageLeft.src = "../images/walk-left.png";
imageRight.src = "../images/walk-right.png";
let player;
let obstacles = [];
let sandbox;
let scrollEngine;
let obstacleStyle = 'rgb(0, 255, 0)';
let obstacleBufferStyle = 'orange';
let playrStyle = 'rgb(0, 255, 0)';
let obstacleTypes = ['rectangle_stroke', 'rectangle_fill'];
let floorY = 74 * config.scale;

Promise.all([imageLeft, imageRight]).then((images) => {
    player = new Player(images[0], images[1], [- width / 2 + 10, -74 / 2], 10, 5, [102 * config.scale, 148 * config.scale], playrStyle, config);
    obstacles.push(new Obstacle([-width / 2 + 300 * config.scale, floorY], [width, height / 4 - floorY], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([-width / 2 + 300 * config.scale + width, floorY], [width / 4, height / 4 - floorY], obstacleBufferStyle, obstacleTypes[1], config, true));
    obstacles.push(new Obstacle([-width / 2 + 300 * config.scale + 1.25 * width, floorY], [width / 2, height / 4 - floorY], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([-width / 2 + 300 * config.scale + 1.75 * width, floorY], [width / 4, height / 4 - floorY], obstacleBufferStyle, obstacleTypes[1], config, true));
    obstacles.push(new Obstacle([-width / 2 + 300 * config.scale + 2 * width, floorY], [width / 2, height / 4 - floorY], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([-width / 2 + 300 * config.scale + 2.5 * width, 0], [width / 4, height / 4 - floorY], obstacleBufferStyle, obstacleTypes[1], config, true));
    obstacles.push(new Obstacle([-width / 2 + 300 * config.scale + 2.75 * width, floorY], [width / 2, height / 4 - floorY], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([-width / 2 + 300 * config.scale + 3.45 * width, floorY], [width / 2, height / 4 - floorY], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([100, -3], [75, 40], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([137, -38], [75, 50], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([-200, -125], [75, 5], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([-25, -80], [75, 5], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([400, -13], [125, 50], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([600, -13], [125, 50], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([900, -13], [125, 50], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([1050, -73], [125, 12], obstacleStyle, obstacleTypes[1], config));
    obstacles.push(new Obstacle([1350, -40], [100, 12], obstacleStyle, obstacleTypes[1], config));
    scrollEngine = new ScrollEngine(player, obstacles, config);
    scrollEngine.setScrollControls();
    sandbox = new Sandbox(player, obstacles, scrollEngine, config);
    sandbox.run(0);
    sandbox.calcFrames();
});