const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const groundLevel = height / 4;
const centerLineX = 0;
const centerLeft = -10;
const centerRight = 10;
const leftScrollCenterFactor = 400;
const leftScrollLeft = - width / 2 + leftScrollCenterFactor - 10;
const leftScrollRight = - width / 2 + leftScrollCenterFactor + 10;
const invisibleLeft = - width / 2;  // - 200;
const invisibleRight = width / 2; //+ 200;

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

const fps = 60;
const msPerFrame = 1000 / fps; // 16.666666667
const velFactor = 60 / fps;

Promise.all([imageLeft, imageRight]).then((images) => {
    player = new Player(images[0], images[1], [- width / 2 + 10, -74], 10, 5, [102, 148], playrStyle);
    obstacles.push(new Obstacle([-width / 2 + 300, 74], [width, height / 4 - 74], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([-width / 2 + 300 + width, 74], [width / 4, height / 4 - 74], obstacleBufferStyle, obstacleTypes[1], true));
    obstacles.push(new Obstacle([-width / 2 + 300 + 1.25 * width, 74], [width / 2, height / 4 - 74], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([-width / 2 + 300 + 1.75 * width, 74], [width / 4, height / 4 - 74], obstacleBufferStyle, obstacleTypes[1], true));
    obstacles.push(new Obstacle([-width / 2 + 300 + 2 * width, 74], [width / 2, height / 4 - 74], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([-width / 2 + 300 + 2.5 * width, 0], [width / 4, height / 4 - 74], obstacleBufferStyle, obstacleTypes[1], true));
    obstacles.push(new Obstacle([-width / 2 + 300 + 2.75 * width, 74], [width / 2, height / 4 - 74], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([-width / 2 + 300 + 3.45 * width, 74], [width / 2, height / 4 - 74], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([200, -6], [150, 80], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([275, -76], [150, 100], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([-400, -250], [150, 10], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([-100, -160], [150, 10], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([800, -26], [250, 100], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([1200, -26], [250, 100], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([1800, -26], [250, 100], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([2100, -146], [250, 25], obstacleStyle, obstacleTypes[1]));
    obstacles.push(new Obstacle([2600, -146], [250, 25], obstacleStyle, obstacleTypes[1]));
    scrollEngine = new ScrollEngine(player, obstacles);
    scrollEngine.setScrollControls();
    sandbox = new Sandbox(player, obstacles, scrollEngine);
    sandbox.run(0);
    sandbox.calcFrames();
});

class Sprite {
    constructor(posX, posY, spriteWidth, spriteHeight, color) {
        this.posX = posX;
        this.posY = posY;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.notCollisionColor = color;
        this.spriteFrames = 0;
    }

    get collisionCenterX() {
        return this.posX + this.spriteWidth / 2;
    }

    get collisionCenterY() {
        return this.posY + this.spriteHeight / 2;
    }
}

class Obstacle extends Sprite {
    constructor(position, size, color, type, isBuffer) {
        super(position[0], position[1], size[0], size[1], color);
        this.color = color;
        this.type = type;
        this.isBuffer = isBuffer;
    }

    draw() {
        // ctx.beginPath();
        switch (this.type) {
            case 'rectangle_stroke':
                ctx.strokeStyle = this.color;
                ctx.strokeRect(this.posX, this.posY, this.spriteWidth, this.spriteHeight);
                break;
            case 'rectangle_fill':
                ctx.fillStyle = this.color;
                ctx.fillRect(this.posX, this.posY, this.spriteWidth, this.spriteHeight);
        }
    }
}

class Player extends Sprite {
    #AkeyDown = false;
    #DkeyDown = false;
    #SpaceKeyDown = false;
    #fasten = false;
    #jump = false;
    #isMove = false;
    #drawCollisionBox = true;
    #leftBlock = false;
    #rightBlock = false;
    #topBlock = false;
    #bottomBlock = false;
    #enabaleScroll = true; // scroll switch
    #isAtBuffer = false;

    constructor(imageLeft, imageRight, position, frameRate, fastFrameRate, spriteSize, color) {
        super(position[0], position[1], spriteSize[0], spriteSize[1], color);
        this.velX = 2;
        this.velY = 9;
        this.velXFast = 6;
        this.velG = 0;
        this.direction = 'right';
        this.imageLeft = imageLeft;
        this.imageRight = imageRight;
        this.sprite = 0;
        this.jumpMaxHeight = 200;
        this.frameRate = frameRate;
        this.fastFrameRate = fastFrameRate;
        this.inAirFrame = 0;
        this.elapsedTime = 0;
        this.gravity = 9.8;
        this.upEffect = 1.7;
        this.downEffect = 2.6;
        this.elapsedMSPerFrame = msPerFrame;
        this.color = color;
        this.jumpTimes = 0;
        this.topJumpTimes = 1;
        this.scrollActiveColor = 'green';
    }

    //#region getter
    get bottomY() {
        return this.posY + this.spriteHeight;
    }

    get isInAir() {
        return this.bottomY < groundLevel && !this.#bottomBlock;
    }

    get isFalling() {
        return !this.jump && this.isInAir;
    }

    get isAtCenter() {
        return this.collisionCenterX >= centerLineX + centerLeft && this.collisionCenterX <= centerLineX + centerRight;
    }

    get isAtRightSection() {
        return this.collisionCenterX >= centerLineX;
    }

    get isWithinRightSection() {
        return this.collisionCenterX > centerLineX;
    }

    get isAtLeftScrollLine() {
        return this.collisionCenterX >= leftScrollLeft && this.collisionCenterX <= leftScrollRight;
    }

    get isAtLeftBorder() {
        let gap = this.#fasten ? velFactor * this.velXFast : velFactor * this.velX;
        return this.collisionCenterX <= - width / 2 + this.spriteWidth / 2 
            && this.collisionCenterX >= - width / 2 + this.spriteWidth / 2 - gap;
    }

    get isAtRightBorder() {
        let gap = this.#fasten ? velFactor * this.velXFast : velFactor * this.velX;
        return this.collisionCenterX >= width / 2 - this.spriteWidth / 2
            && this.collisionCenterX <= width / 2 - this.spriteWidth / 2 + gap;
    }

    get centerX() {
        return - this.spriteWidth / 2;
    }

    get leftScrollX() {
        return - width / 2 + leftScrollCenterFactor - this.spriteWidth / 2;
    }

    get isBlockHorizontal() {
        return this.#leftBlock || this.#rightBlock;
    }

    get jump() {
        return this.#jump;
    }

    get AKeyDown() {
        return this.#AkeyDown;
    }

    get DKeyDown() {
        return this.#DkeyDown;
    }

    get SpaceKeyDown() {
        return this.#SpaceKeyDown;
    }

    get enableScroll() {
        return this.#enabaleScroll;
    }

    get isAtBuffer() {
        return this.#isAtBuffer;
    }
    //#endregion

    //#region setter
    /**
     * @param {boolean} isMove
     */
    set isMove(isMove) {
        this.#isMove = isMove;
    }

    /**
     * @param {boolean} fasten
     */
    set fasten(fasten) {
        this.#fasten = fasten;
    }

    set AKeyDown(akeydown) {
        this.#AkeyDown = akeydown;
    }

    set DKeyDown(dkeydown) {
        this.#DkeyDown = dkeydown;
    }

    set SpaceKeyDown(spacekeydown) {
        this.#SpaceKeyDown = spacekeydown;
    }
    //#endregion setter

    draw() {
        if (this.direction === 'right') {
            ctx.drawImage(this.imageRight, this.sprite * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 + this.posX, this.posY, this.spriteWidth, this.spriteHeight);
        } else {
            ctx.drawImage(this.imageLeft, (5 - this.sprite) * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 + this.posX, this.posY, this.spriteWidth, this.spriteHeight);
        }
        if (this.#drawCollisionBox) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.posX, this.posY, this.spriteWidth, this.spriteHeight);
            // ctx.strokeStyle = this.scrollActiveColor;
            // ctx.moveTo(this.collisionCenterX, this.posY);
            // ctx.lineTo(this.collisionCenterX, this.posY - 10);
            // ctx.stroke();
            ctx.fillStyle = this.scrollActiveColor;
            ctx.fillRect(this.collisionCenterX - 5, this.posY - 5, 10, 5);
            // console.log(`dectectCenterX: ${this.detectCenterX}; detectCenterY: ${this.detectCenterY}`);
        }
    }

    checkMovement() {
        if (this.#isMove) {
            if (this.spriteFrames * velFactor % (this.#fasten ? this.fastFrameRate : this.frameRate) === 0) {
                if (this.sprite === 5) {
                    this.sprite = 0;
                } else {
                    this.sprite++;
                }
            }
            if (this.direction === 'right') {
                let lastPosX = this.posX;
                this.posX += this.#fasten ? velFactor * this.velXFast : velFactor * this.velX;
                if (this.#enabaleScroll && this.isAtRightSection && !this.isBlockHorizontal && !this.isAtBuffer && !this.isAtRightBorder) {
                    // console.log('right section');
                    this.posX = lastPosX + this.spriteWidth / 2 < centerLineX ? centerLineX - this.spriteWidth / 2 : lastPosX;
                }
            } else {
                if (!this.isAtLeftBorder && !this.isAtLeftScrollLine || this.isAtBuffer) {
                    this.posX -= this.#fasten ? velFactor * this.velXFast : velFactor * this.velX;
                }
                if (this.#enabaleScroll && this.isAtLeftScrollLine && !this.isBlockHorizontal && !this.isAtBuffer && !this.isAtLeftBorder) {
                    this.posX = this.posX > this.leftScrollX ? this.posX : this.leftScrollX;
                }
            }
            this.spriteFrames++;
        } else {
            this.sprite = 0;
            this.spriteFrames = 0;
        }

        if (this.#jump) {
            this.inAirFrame++;
            if (this.inAirFrame % 1 === 0) {
                this.elapsedTime += this.elapsedMSPerFrame / 1000;
                // console.log(`${this.elapsedTime}ms`);
            }
            this.velG = this.velY - this.upEffect * this.gravity * this.elapsedTime;
            if (this.velG > 0) { //&& this.posY > -this.jumpMaxHeighta
                this.posY -= this.velG * velFactor;
                // console.log(this.velY * this.elapsedTime);
                this.sprite = this.direction === 'right' ? 2 : 5;
            } else {
                this.resetJumpStatus(false); // fall at top
            }
        } else if (this.bottomY < groundLevel && !this.#bottomBlock) { // falling
            this.inAirFrame++;
            if (this.inAirFrame % 1 === 0) {
                this.elapsedTime += this.elapsedMSPerFrame / 1000;
                // console.log(`${this.elapsedTime}ms`);
            }
            this.posY += (this.velY + this.downEffect * this.gravity * this.elapsedTime) * velFactor;
            // console.log(`deltaVelY: ${this.velY + this.downEffect * this.gravity * this.elapsedTime}`);
            if (this.bottomY > groundLevel) {
                this.posY = groundLevel - this.spriteHeight;
                this.jumpTimes = 0;
                this.velG = 0; // can be ignored, velG will reset when jumping up.
                if (this.#SpaceKeyDown) {
                    this.resetJumpStatus(true);
                }
            }
        }
    }

    collisionDetect(obstacles) {
        const collisionColor = 'rgb(255, 0, 0)';
        const bufferCollisionColor = 'brown';
        this.#leftBlock = this.#rightBlock = this.#topBlock = this.#bottomBlock = false;
        let isAtBuffer = false;
        obstacles.forEach((obs) => {
            let dx = Math.abs(this.collisionCenterX - obs.collisionCenterX);
            let dy = Math.abs(this.collisionCenterY - obs.collisionCenterY);
            let attachWidth = this.spriteWidth / 2 + obs.spriteWidth / 2;
            let attachHeight = this.spriteHeight / 2 + obs.spriteHeight / 2;
            let isBlock = false;

            if (dy < attachHeight) {
                let xgap = this.#fasten ? velFactor * this.velXFast : velFactor * this.velX;

                if (this.collisionCenterX < obs.collisionCenterX && dx <= attachWidth && dx >= attachWidth - xgap) {
                    // console.log(`xgap:${xgap} dx:${dx} attachWidth:${attachWidth}`);
                    this.#rightBlock = true;
                    this.posX = obs.posX - this.spriteWidth;
                    dx = Math.abs(this.collisionCenterX - obs.collisionCenterX);
                    isBlock = true;
                }

                if (this.collisionCenterX > obs.collisionCenterX && dx <= attachWidth && dx >= attachWidth - xgap) {
                    // console.log(`xgap:${xgap} dx:${dx} attachWidth:${attachWidth}`);
                    this.#leftBlock = true;
                    this.posX = obs.posX + obs.spriteWidth;
                    dx = Math.abs(this.collisionCenterX - obs.collisionCenterX);
                    isBlock = true;
                }
            }

            if (dx < attachWidth) {
                if (this.collisionCenterY < obs.collisionCenterY && dy <= attachHeight) {
                    this.#bottomBlock = true;
                    this.posY = obs.posY - this.spriteHeight;
                    dy = Math.abs(this.collisionCenterY - obs.collisionCenterY);
                    isBlock = true;
                    this.resetJumpStatus(false);
                    this.jumpTimes = 0;
                    this.velG = 0; // can be ignored, but when bottom is blocked, velG should be 0.
                    // console.log(`${this.#bottomBlock}`);
                    if (this.#SpaceKeyDown) {
                        this.resetJumpStatus(true);
                    }
                }

                if (this.collisionCenterY > obs.collisionCenterY && dy <= attachHeight) {
                    this.#topBlock = true;
                    this.resetJumpStatus(false);
                    this.posY = obs.posY + obs.spriteHeight;
                    dy = Math.abs(this.collisionCenterY - obs.collisionCenterY);
                    isBlock = true;
                }
            }

            if (isBlock) {
                obs.color = collisionColor;
            } else {
                obs.color = obs.notCollisionColor;
            }

            if (obs.isBuffer && this.posX >= obs.posX - this.spriteWidth && this.posX <= obs.posX + obs.spriteWidth) {
                isAtBuffer = true;
                obs.color = bufferCollisionColor;
            }
        });
        if (isAtBuffer) {
            this.#isAtBuffer = true;
        } else {
            this.#isAtBuffer = false;
        }
    }

    checkBound() {
        let rate = this.#fasten ? this.fastFrameRate : this.frameRate;
        let gap = this.#fasten ? velFactor * this.velXFast : velFactor * this.velX;
        if (this.collisionCenterX > width / 2 - this.spriteWidth / 2 
            && this.collisionCenterX <= width / 2 - this.spriteWidth / 2 + gap 
            // && !this.isInAir && this.direction === 'right'
            ) { // right border
            this.posX = width / 2 - this.spriteWidth;
            // console.log('right border reaches.');
        } else if (this.collisionCenterX < - width / 2 + this.spriteWidth / 2 
            && this.collisionCenterX >= - width / 2 + this.spriteWidth / 2 - gap
            // && !this.isInAir && this.direction === 'left'
            ) { // left border
            this.posX = - width / 2;
            // console.log('left border reaches.');
        }

        // if (this.posX < invisibleLeft) {
        //     this.posX = invisibleLeft;
        // } else if (this.posX > invisibleRight - this.spriteWidth) {
        //     this.posX = invisibleRight - this.spriteWidth;
        // }
    }

    checkCollisionHappened() {
        let collisionColor = 'rgb(255, 0, 0)';
        if (this.#leftBlock || this.#rightBlock || this.#topBlock || this.#bottomBlock) {
            this.color = collisionColor;
        } else {
            this.color = this.notCollisionColor;
        }
    }

    resetJumpStatus(jump) {
        this.#jump = jump;
        this.inAirFrame = 0;
        this.elapsedTime = 0;
    }
}

class ScrollEngine {
    #fasten;
    #AkeyDown = false;
    #DKeyDown = false;
    #lockScroll = false;

    constructor(player, obstacles) {
        this.player = player;
        this.obstacles = obstacles;
        this.scrollDirection = 'left';
        this.scrollIsMoving = false;
        this.scrollVelX = 2;
        this.scrollFastVelX = 6;
    }

    get isMoving() {
        return this.player.enableScroll && !this.player.isBlockHorizontal //&& (!player.isInAir || (player.isInAir && player.isFalling))
        && ((!this.player.isAtBuffer && !this.#lockScroll
        && ((player.isAtLeftScrollLine && this.#AkeyDown) 
            || (player.isAtRightSection && this.#DKeyDown)))
            || ((player.isAtLeftBorder && this.#AkeyDown)
            || (player.isAtRightBorder && this.#DKeyDown)));
    }

    setScrollControls() {
        let player = this.player;
        window.onkeydown = e => {
            this.#lockScroll = false;
            switch (e.key) {
                case 'a':
                case 'A':
                case 'ArrowLeft':
                    player.direction = 'left';
                    player.isMove = true;
                    player.AkeyDown = true;
                    this.#AkeyDown = true;
                    this.scrollDirection = 'right';
                    if (this.#DKeyDown && player.isWithinRightSection) {
                        this.#lockScroll = true;
                    }
                    break;
                case 'd':
                case 'D':
                case 'ArrowRight':
                    player.direction = 'right';
                    player.isMove = true;
                    player.DkeyDown = true;
                    this.#DKeyDown = true;
                    this.scrollDirection = 'left';
                    break;
                case 'w':
                case 'W':
                case 'ArrowUp':
                    break;
                case 's':
                case 'S':
                case 'ArrowDown':
                    break;
                case 'Shift':
                    player.fasten = true;
                    this.#fasten = true;
                    break;
                case ' ':
                    // **** !player.jump && player.velG > 0 means player is falling when not hit the highest place. ****
                    if (player.bottomY === groundLevel || (!player.jump && player.velG > 0 && player.jumpTimes < player.topJumpTimes)) {
                        // console.log(`${player.bottomY} ${player.jumpTimes} ${player.velG} ${player.jumpTimes < player.topJumpTimes && player.bottomY < groundLevel}`);
                        if (player.jumpTimes < player.topJumpTimes && player.isInAir) {
                            player.jumpTimes++;
                        }

                        player.resetJumpStatus(true);
                    }
                    player.SpaceKeyDown = true;
                    break;
            }
        }

        window.onkeyup = e => {
            this.#lockScroll = false;
            switch (e.key) {
                case 'a':
                case 'A':
                case 'ArrowLeft':
                    player.AkeyDown = false;
                    if (player.DkeyDown) {
                        player.direction = 'right';
                    } else {
                        player.isMove = false;
                    }
                    this.#AkeyDown = false;
                    if (this.#DKeyDown) {
                        this.scrollDirection = 'left';
                    }
                    break;
                case 'd':
                case 'D':
                case 'ArrowRight':
                    player.DkeyDown = false;
                    if (player.AkeyDown) {
                        player.direction = 'left';
                    } else {
                        player.isMove = false;
                    }
                    this.#DKeyDown = false;
                    if (this.#AkeyDown) {
                        this.scrollDirection = 'right';
                    }
                    break;
                case 'w':
                case 'W':
                case 'ArrowUp':
                case 's':
                case 'S':
                case 'ArrowDown':
                    break;
                case 'Shift':
                    player.fasten = false;
                    this.#fasten = false;
                    break;
                case ' ':
                    player.resetJumpStatus(false);
                    player.SpaceKeyDown = false;
                    break;
            }
        }
    }

    scroll() {
        if (this.isMoving) 
        {
            if (this.scrollDirection === 'left') {
                this.obstacles.forEach(obs => {
                    obs.posX -= this.#fasten ? velFactor * this.scrollFastVelX : velFactor * this.scrollVelX;
                });
                // console.log('scroll is moving left.');
            } else {
                this.obstacles.forEach(obs => {
                    obs.posX += this.#fasten ? velFactor * this.scrollFastVelX : velFactor * this.scrollVelX;
                });
                // console.log('scroll is moving right');
            }
        } else {
            // console.log('scroll stopped.');
        }
    }
}

class Sandbox {
    averageFrames = 0;
    start = undefined;
    preTimeStamp;
    prestamp;
    frames = 0;
    #showTestingLines = true;

    constructor(player, obstacles, scrollEngine) {
        this.player = player;
        this.obstacles = obstacles;
        this.scrollEngine = scrollEngine;
    }

    run(timestamp) {
        // let _this = sandbox;
        //window.requestAnimationFrame(this.run.bind(this));

        if (this.start === undefined) {
            this.start = timestamp;
            this.preTimeStamp = this.prestamp = timestamp;
        }
        const elapsed = timestamp - this.preTimeStamp;
        // const trueElapsed = timestamp - this.prestamp;
        // this.prestamp = timestamp;
        // console.log(trueElapsed);

        if (elapsed < msPerFrame) {
            window.requestAnimationFrame(this.run.bind(this));
            return
        }
        this.frames++;
        const excessTime = elapsed % msPerFrame;
        this.preTimeStamp = timestamp - excessTime;
        // console.log(`timestamp: ${timestamp} elapsed: ${elapsed} excessTime: ${excessTime} pretimestamp: ${this.preTimeStamp} this.frames*msPerFrame: ${this.frames * msPerFrame}`);

        // clear screen
        ctx.fillStyle = '#222';
        ctx.fillRect(- width / 2, - 3 * height / 4, width, height);

        // title
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.font = '36px arial';
        ctx.strokeText('Scroll Engine Test', - width / 2 + 10, - 3 * height / 4 + 36);

        // fps
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 1;
        ctx.font = '18px sans-serif';
        ctx.strokeText(`FPS: ${this.averageFrames.toFixed(2)}`, width / 2 - 100, - 3 * height / 4 + 36);

        this.obstacles.forEach(obs => {
            obs.draw();
        })
        this.player.draw();
        this.player.checkMovement();
        this.player.collisionDetect(obstacles);
        this.player.checkCollisionHappened();
        this.player.checkBound();
        this.scrollEngine.scroll();

        const reachColor = 'blue';
        const notReachColor = 'green';
        if (this.player.isAtRightSection) {
            this.player.scrollActiveColor = reachColor;
            // console.log('player reaches the center.');
        } else if (this.player.isAtLeftScrollLine) {
            this.player.scrollActiveColor = reachColor;
        } else if (this.player.isAtLeftBorder) {
            this.player.scrollActiveColor = reachColor;
        } else if (this.player.isAtRightBorder) {
            this.player.scrollActiveColor = reachColor;
        } else {
            this.player.scrollActiveColor = notReachColor;
        }
        // console.log(`InAir: ${this.player.isInAir}`);
        // console.log(`Falling: ${this.player.isFalling}`);
        // if (this.player.isAtBuffer) {
        //     console.log(`player is at buffer`);
        // }
        // if (this.player.isBlockHorizontal) {
        //     console.log(`player is block horizontal`);
        // }

        // center line
        if (this.#showTestingLines) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.2)';
            ctx.setLineDash([5, 5]);
            // ctx.moveTo(centerLeft, - 3 * height / 4);
            // ctx.lineTo(centerLeft, height / 4);
            // ctx.stroke();
            // ctx.moveTo(centerRight, - 3 * height / 4);
            // ctx.lineTo(centerRight, height / 4);
            ctx.moveTo(centerLineX, - 3 * height / 4);
            ctx.lineTo(centerLineX, height / 4);
            ctx.stroke();
            ctx.moveTo(leftScrollLeft, - 3 * height / 4);
            ctx.lineTo(leftScrollLeft, height / 4);
            ctx.stroke();
            ctx.moveTo(leftScrollRight, - 3 * height / 4);
            ctx.lineTo(leftScrollRight, height / 4);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        window.requestAnimationFrame(this.run.bind(this));
    }

    calcFrames() {
        setInterval(() => {
            // console.log(this.frames);        
            this.averageFrames = this.frames;
            this.frames = 0;
        }, 1000);
    }
}
