<template>
  <div class="app-wrapper" ref="my-app">
    <p id="debug-info-left" ref="debug-info-left"></p>
    <p id="debug-info-right" ref="debug-info-right"></p>
    <my-canvas ref="my-canvas"></my-canvas>
    <game-pad @up-pressed="onGamePadUpPressed" @up-unpressed="onGamePadUpUnpressed"
      @down-pressed="onGamePadDownPressed" @down-unpressed="onGamePadDownUnpressed"
      @right-pressed="onGamePadRightPressed" @right-unpressed="onGamePadRightUnPressed"
      @left-pressed="onGamePadLeftPressed" @left-unpressed="onGamePadLeftUnpressed"
      @x-pressed="onGamePadXPressed" @x-unpressed="onGamePadXUnpressed"
      @y-pressed="onGamePadYPressed" @y-unpressed="onGamePadYUnpressed"
      @a-pressed="onGamePadAPressd" @a-unpressed="onGamePadAUnpressd"
      @b-pressed="onGamePadBPressed" @b-unpressed="onGamePadBUnpressed"></game-pad>
  </div>
</template>

<script>
import MyCanvas from './components/MyCanvas.vue';
import GamePad from './components/GamePad.vue';
import { Obstacle } from './modules/obstacle.js';
import { Player } from './modules/player.js';
import { ScrollEngine } from './modules/scroll_engine.js';
import { Sandbox } from './modules/sandbox.js';
import imgLeft from './assets/walk-left.png';
import imgRight from './assets/walk-right.png';

const width = 500;
const height = 500 * 9 / 16;
const groundLevel = height / 4;
const centerLineX = 0;
const centerLeft = -10;
const centerRight = 10;
const leftScrollCenterFactor = 80;
const leftScrollLeft = - width / 2 + leftScrollCenterFactor - 10;
const leftScrollRight = - width / 2 + leftScrollCenterFactor + 10;

const fps = 60;
const msPerFrame = 1000 / fps; // 16.666666667
const velFactor = 60 / fps;

const scale = 0.5;

const config = {
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

let player;
let obstacles = [];
let sandbox;
let scrollEngine;

export default {
  name: 'App',
  components: {
    MyCanvas,
    GamePad
  },
  methods: {
    onGamePadUpPressed() {
      console.log('game pad up pressed');
    },
    onGamePadUpUnpressed() {
      console.log('game pad up unpressed');
    },
    onGamePadDownPressed() {
      console.log('game pad down pressed');
    },
    onGamePadDownUnpressed() {
      console.log('game pad down unpressed');
    },
    onGamePadRightPressed() {
      player.direction = 'right';
      player.isMove = true;
      scrollEngine.scrollDirection = 'left';
      scrollEngine.DkeyDown = true;
      console.log(`${player.direction} isMove:${player.isMove}`);
      this.$refs['debug-info-left'].textContent = `${player.direction} isMove:${player.isMove}`;
    },
    onGamePadRightUnPressed() {
      player.isMove = false;
      scrollEngine.DkeyDown = false;
      console.log(`${player.direction} isMove:${player.isMove}`);
      this.$refs['debug-info-left'].textContent = `${player.direction} isMove:${player.isMove}`;
    },
    onGamePadLeftPressed() {
      player.direction = 'left';
      player.isMove = true;
      scrollEngine.scrollDirection = 'right';
      scrollEngine.AkeyDown = true;
      console.log(`${player.direction} isMove:${player.isMove}`);
      this.$refs['debug-info-left'].textContent = `${player.direction} isMove:${player.isMove}`;
    },
    onGamePadLeftUnpressed() {
      player.isMove = false;
      scrollEngine.AkeyDown = false;
      console.log(`${player.direction} isMove:${player.isMove}`);
      this.$refs['debug-info-left'].textContent = `${player.direction} isMove:${player.isMove}`;
    },
    onGamePadXPressed() {
      console.log('game pad X pressed');
    },
    onGamePadXUnpressed() {
      console.log('game pad X unpressed');
    },
    onGamePadYPressed() {
      console.log('game pad Y pressed');
    },
    onGamePadYUnpressed() {
      console.log('game pad Y unpressed');
    },
    onGamePadAPressd() {
      player.fasten = true;
      scrollEngine.fasten = true;
      console.log(`player-fasten:${player.fasten} scroll-engine-fasten:${scrollEngine.fasten}`);
      this.$refs['debug-info-right'].textContent = `player-fasten:${player.fasten} scroll-engine-fasten:${scrollEngine.fasten}`;
    },
    onGamePadAUnpressd() {
      player.fasten = false;
      scrollEngine.fasten = false;
      console.log(`player-fasten:${player.fasten} scroll-engine-fasten:${scrollEngine.fasten}`);
      this.$refs['debug-info-right'].textContent = `player-fasten:${player.fasten} scroll-engine-fasten:${scrollEngine.fasten}`;
    },
    onGamePadBPressed() {
      if (player.bottomY === config.groundLevel || (!player.jump && player.velG > 0 && player.jumpTimes < player.topJumpTimes)) {
        if (player.jumpTimes < player.topJumpTimes && player.isInAir) {
          player.jumpTimes++;
        }
        console.log('jump');

        player.resetJumpStatus(true);
      }
      player.SpaceKeyDown = true;
      console.log(`player-jump:${player.jump || player.SpaceKeyDown}`);
      this.$refs['debug-info-right'].textContent = `player-jump:${player.jump || player.SpaceKeyDown}`;
    },
    onGamePadBUnpressed() {
      player.resetJumpStatus(false);
      player.SpaceKeyDown = false;
      console.log(`player-jump:${player.jump || player.SpaceKeyDown}`);
      this.$refs['debug-info-right'].textContent = `player-jump:${player.jump || player.SpaceKeyDown}`;
    }
  },
  mounted() {
    const ctx = this.$refs['my-canvas'].provider.context;
    config.ctx = ctx;

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, 3 * height / 4);

    let imageLeft = new Image();
    let imageRight = new Image();
    imageLeft.src = imgLeft;
    imageRight.src = imgRight;
    let obstacleStyle = 'rgb(0, 255, 0)';
    let obstacleBufferStyle = 'orange';
    let playrStyle = 'rgb(0, 255, 0)';
    let obstacleTypes = ['rectangle_stroke', 'rectangle_fill'];
    let floorY = 74 * config.scale;

    this.$refs['my-app'].style['height'] = `${window.innerHeight}px`;
    this.$refs['my-app'].style['width'] = `${window.innerWidth}px`;

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
  }
}
</script>

<style>
#debug-info-left {
  position: absolute;
}

#debug-info-right {
  position: absolute;
  right: 100px;
  top: -15px;
}

.app-wrapper {
  background-color: #333;
}

.my-canvas-wrapper canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
