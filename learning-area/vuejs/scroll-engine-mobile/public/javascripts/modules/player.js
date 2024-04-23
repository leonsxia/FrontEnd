import { Sprite } from "./sprite.js";

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

    constructor(imageLeft, imageRight, position, frameRate, fastFrameRate, spriteSize, color, config) {
        super(position[0], position[1], spriteSize[0], spriteSize[1], color, config);
        this.velX = 1;
        this.velY = 6;
        this.velXFast = 3;
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
        this.downEffect = 1.6;
        this.elapsedMSPerFrame = this.config.msPerFrame;
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
        return this.bottomY < this.config.groundLevel && !this.#bottomBlock;
    }

    get isFalling() {
        return !this.jump && this.isInAir;
    }

    get isAtCenter() {
        return this.collisionCenterX >= this.config.centerLineX + this.config.centerLeft && this.collisionCenterX <= this.config.centerLineX + this.config.centerRight;
    }

    get isAtRightSection() {
        return this.collisionCenterX >= this.config.centerLineX;
    }

    get isWithinRightSection() {
        return this.collisionCenterX > this.config.centerLineX;
    }

    get isAtLeftScrollLine() {
        return this.collisionCenterX >= this.config.leftScrollLeft && this.collisionCenterX <= this.config.leftScrollRight;
    }

    get isAtLeftBorder() {
        let gap = this.#fasten ? this.config.velFactor * this.velXFast : this.config.velFactor * this.velX;
        return this.collisionCenterX <= - this.config.width / 2 + this.spriteWidth / 2 
            && this.collisionCenterX >= - this.config.width / 2 + this.spriteWidth / 2 - gap;
    }

    get isAtRightBorder() {
        let gap = this.#fasten ? this.config.velFactor * this.velXFast : this.config.velFactor * this.velX;
        return this.collisionCenterX >= this.config.width / 2 - this.spriteWidth / 2
            && this.collisionCenterX <= this.config.width / 2 - this.spriteWidth / 2 + gap;
    }

    get centerX() {
        return - this.spriteWidth / 2;
    }

    get leftScrollX() {
        return - this.config.width / 2 + this.config.leftScrollCenterFactor - this.spriteWidth / 2;
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
            this.config.ctx.drawImage(this.imageRight, this.sprite * this.spriteWidth / this.config.scale, 0, this.spriteWidth / this.config.scale, this.spriteHeight / this.config.scale, 0 + this.posX, this.posY, this.spriteWidth, this.spriteHeight);
        } else {
            this.config.ctx.drawImage(this.imageLeft, (5 - this.sprite) * this.spriteWidth / this.config.scale, 0, this.spriteWidth / this.config.scale, this.spriteHeight / this.config.scale, 0 + this.posX, this.posY, this.spriteWidth, this.spriteHeight);
        }
        if (this.#drawCollisionBox) {
            this.config.ctx.beginPath();
            this.config.ctx.strokeStyle = this.color;
            this.config.ctx.strokeRect(this.posX, this.posY, this.spriteWidth, this.spriteHeight);
            // ctx.strokeStyle = this.scrollActiveColor;
            // ctx.moveTo(this.collisionCenterX, this.posY);
            // ctx.lineTo(this.collisionCenterX, this.posY - 10);
            // ctx.stroke();
            this.config.ctx.fillStyle = this.scrollActiveColor;
            this.config.ctx.fillRect(this.collisionCenterX - 5, this.posY - 5, 10, 5);
            // console.log(`dectectCenterX: ${this.detectCenterX}; detectCenterY: ${this.detectCenterY}`);
        }
    }

    checkMovement() {
        if (this.#isMove) {
            if (this.spriteFrames * this.config.velFactor % (this.#fasten ? this.fastFrameRate : this.frameRate) === 0) {
                if (this.sprite === 5) {
                    this.sprite = 0;
                } else {
                    this.sprite++;
                }
            }
            if (this.direction === 'right') {
                let lastPosX = this.posX;
                this.posX += this.#fasten ? this.config.velFactor * this.velXFast : this.config.velFactor * this.velX;
                if (this.#enabaleScroll && this.isAtRightSection && !this.isBlockHorizontal && !this.isAtBuffer && !this.isAtRightBorder) {
                    // console.log('right section');
                    this.posX = lastPosX + this.spriteWidth / 2 < this.config.centerLineX ? this.config.centerLineX - this.spriteWidth / 2 : lastPosX;
                }
            } else {
                if (!this.isAtLeftBorder && !this.isAtLeftScrollLine || this.isAtBuffer) {
                    this.posX -= this.#fasten ? this.config.velFactor * this.velXFast : this.config.velFactor * this.velX;
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
                this.posY -= this.velG * this.config.velFactor;
                // console.log(this.velY * this.elapsedTime);
                this.sprite = this.direction === 'right' ? 2 : 5;
            } else {
                this.resetJumpStatus(false); // fall at top
            }
        } else if (this.bottomY < this.config.groundLevel && !this.#bottomBlock) { // falling
            this.inAirFrame++;
            if (this.inAirFrame % 1 === 0) {
                this.elapsedTime += this.elapsedMSPerFrame / 1000;
                // console.log(`${this.elapsedTime}ms`);
            }
            this.posY += (this.velY + this.downEffect * this.gravity * this.elapsedTime) * this.config.velFactor;
            // console.log(`deltaVelY: ${this.velY + this.downEffect * this.gravity * this.elapsedTime}`);
            if (this.bottomY > this.config.groundLevel) {
                this.posY = this.config.groundLevel - this.spriteHeight;
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
                let xgap = this.#fasten ? this.config.velFactor * this.velXFast : this.config.velFactor * this.velX;

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
        let gap = this.#fasten ? this.config.velFactor * this.velXFast : this.config.velFactor * this.velX;
        if (this.collisionCenterX > this.config.width / 2 - this.spriteWidth / 2 
            && this.collisionCenterX <= this.config.width / 2 - this.spriteWidth / 2 + gap 
            // && !this.isInAir && this.direction === 'right'
            ) { // right border
            this.posX = this.config.width / 2 - this.spriteWidth;
            // console.log('right border reaches.');
        } else if (this.collisionCenterX < - this.config.width / 2 + this.spriteWidth / 2 
            && this.collisionCenterX >= - this.config.width / 2 + this.spriteWidth / 2 - gap
            // && !this.isInAir && this.direction === 'left'
            ) { // left border
            this.posX = - this.config.width / 2;
            // console.log('left border reaches.');
        }
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

export { Player };