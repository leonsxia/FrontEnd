    const canvas = document.querySelector('.myCanvas');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const groundLevel = height / 4;
    let frames = 0;

    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, 3 * height / 4);

    let imageLeft = new Image();
    let imageRight = new Image();
    imageLeft.src = "walk-left.png";
    imageRight.src = "walk-right.png";
    let player;
    let obstacles = [];
    let obstacleStyle = 'rgb(0, 255, 0)';
    let playrStyle = 'rgb(0, 255, 0)';
    let obstacleTypes = ['rectangle_stroke', 'rectangle_fill'];

    let averageFrames = 0;
    let start, preTimeStamp, prestamp;
    const fps = 60;
    const msPerFrame = 1000 / fps; // 16.666666667

    function run(timestamp) {
        requestAnimationFrame(run);

        if (start === undefined) {
            start = timestamp;
            preTimeStamp = prestamp = timestamp;
        }
        const elapsed = timestamp - preTimeStamp;
        // const trueElapsed = timestamp - prestamp;
        // prestamp = timestamp;
        // console.log(trueElapsed);
        
        if (elapsed < msPerFrame) {
            return
        }
        frames++;
        const excessTime = elapsed % msPerFrame;
        preTimeStamp = timestamp - excessTime;
        // console.log(`timestamp: ${timestamp} elapsed: ${elapsed} excessTime: ${excessTime} pretimestamp: ${preTimeStamp} frames*msPerFrame: ${frames * msPerFrame}`);
        
        // clear screen
        ctx.fillStyle = '#222';
        ctx.fillRect(- width / 2, - 3 * height / 4, width, height);

        // title
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.font = "36px arial";
        ctx.strokeText("Scroll Engine Test", - width / 2 + 10, - 3 * height / 4 + 36);

        // fps
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1;
        ctx.font = "18px sans-serif";
        ctx.strokeText(`FPS: ${averageFrames.toFixed(2)}`, width / 2 - 100, - 3 * height / 4 + 36);
        
        obstacles.forEach(obs => {
            obs.draw();
        })
        player.draw();
        player.checkMovement();
        player.collisionDetect(obstacles);
        player.checkCollisionHappened();
        player.checkBound(); 
    }

    Promise.all([imageLeft, imageRight]).then((images) => {
        player = new Player(images[0], images[1], [- width / 2 + 10, -74], 10, 5, [102, 148], playrStyle);
        player.setControls();
        obstacles.push(new Obstacle([-width / 2 + 300, 74], [width - 300, height / 4 - 74], obstacleStyle, obstacleTypes[1]));
        obstacles.push(new Obstacle([200, -6], [150, 80], obstacleStyle, obstacleTypes[1]));
        obstacles.push(new Obstacle([275, -76], [150, 100], obstacleStyle, obstacleTypes[1]));
        obstacles.push(new Obstacle([-400, -250], [150, 10], obstacleStyle, obstacleTypes[1]));
        obstacles.push(new Obstacle([-100, -160], [150, 10], obstacleStyle, obstacleTypes[1]));
        run(0);
        setInterval(() => {
            // console.log(frames);        
            averageFrames = frames;
            frames = 0;
        }, 1000);
        // draw();
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
        constructor(position, size, color, type) {
            super(position[0], position[1], size[0], size[1], color);
            this.color = color;
            this.type = type;
        }

        draw() {
            ctx.beginPath();
            switch (this.type) {
                case 'rectangle_stroke':
                    ctx.strokeStyle = this.color;
                    ctx.strokeRect(this.posX, this.posY , this.spriteWidth, this.spriteHeight);
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
            // this.jumpTime = 0;
            this.inAirFrame = 0;
            this.elapsedTime = 0;
            this.gravity = 9.8;
            this.upEffect = 1.8;
            this.downEffect = 2.6;
            this.elapsedMSPerFrame = msPerFrame;
            this.color = color;
            this.jumpTimes = 0;
            this.topJumpTimes = 1;
        }

        get bottomY() {
            return this.posY + this.spriteHeight;
        }

        draw() {
            if (this.direction === 'right') {
                ctx.drawImage(this.imageRight, this.sprite * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 + this.posX, this.posY, this.spriteWidth, this.spriteHeight);
            } else {
                ctx.drawImage(this.imageLeft, (5 - this.sprite) * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0 + this.posX, this.posY, this.spriteWidth, this.spriteHeight);
            }
            if (this.#drawCollisionBox) {
                ctx.strokeStyle = this.color;
                ctx.strokeRect(this.posX, this.posY , this.spriteWidth, this.spriteHeight);
                // console.log(`dectectCenterX: ${this.detectCenterX}; detectCenterY: ${this.detectCenterY}`);
            }
        }

        setControls() {
            window.onkeydown = e => {
                switch (e.key) {
                    case 'a':
                    case 'A':
                    case 'ArrowLeft':
                        this.direction = 'left';
                        // this.posX -= this.velX;
                        this.#isMove = true;
                        this.#AkeyDown = true;
                        break;
                    case 'd':
                    case 'D':
                    case 'ArrowRight':
                        this.direction = 'right';
                        // this.posX += this.velX;
                        this.#isMove = true;
                        this.#DkeyDown = true;
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
                        this.#fasten = true;
                        break;
                    case ' ':
                        if (this.bottomY === groundLevel || (!this.#jump && this.velG > 0 && this.jumpTimes < this.topJumpTimes)) {
                            // console.log(`${this.bottomY} ${this.jumpTimes} ${this.velG} ${this.jumpTimes < this.topJumpTimes && this.bottomY < groundLevel}`);
                            if (this.jumpTimes < this.topJumpTimes && this.bottomY < groundLevel && !this.#bottomBlock) {
                                this.jumpTimes++;
                            }                            
                            
                            this.resetJumpStatus(true);
                        }
                        this.#SpaceKeyDown = true;
                        break;
                }
            }

            window.onkeyup = e => {
                switch (e.key) {
                    case 'a':
                    case 'A':
                    case 'ArrowLeft':
                        this.#AkeyDown = false;
                        if (this.#DkeyDown) {
                            this.direction = 'right';
                        } else {
                            this.#isMove = false;
                        }
                        break;
                    case 'd':
                    case 'D':
                    case 'ArrowRight':
                        this.#DkeyDown = false;
                        if (this.#AkeyDown) {
                            this.direction = 'left';
                        } else {
                            this.#isMove = false;
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
                        this.#fasten = false;
                        break;
                    case ' ':
                        this.resetJumpStatus(false);
                        this.#SpaceKeyDown = false;
                        break;
                }
            }
        }

        checkMovement() {
            if (this.#isMove) {
                if (this.spriteFrames % (this.#fasten ? this.fastFrameRate : this.frameRate) === 0) {
                    if (this.sprite === 5) {
                        this.sprite = 0;
                    } else {
                        this.sprite++;
                    }
                }
                if (this.direction === 'right') {
                    this.posX += this.#fasten ? this.velXFast : this.velX;
                } else {
                    this.posX -= this.#fasten ? this.velXFast : this.velX;
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
                this.velG = this.velY - this.upEffect * this.gravity * this.elapsedTime
                if (this.velG > 0 ) { //&& this.posY > -this.jumpMaxHeighta
                    this.posY -= this.velG;
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
                this.posY += this.velY + this.downEffect * this.gravity * this.elapsedTime;
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
            this.#leftBlock = this.#rightBlock = this.#topBlock = this.#bottomBlock = false;
            obstacles.forEach((obs) => {
                let dx = Math.abs(this.collisionCenterX - obs.collisionCenterX);
                let dy = Math.abs(this.collisionCenterY - obs.collisionCenterY);
                let attachWidth = this.spriteWidth / 2 + obs.spriteWidth / 2;
                let attachHeight = this.spriteHeight / 2 + obs.spriteHeight / 2;
                let collisionColor = 'rgb(255, 0, 0)';
                let isBlock = false;
                
                if (dy < attachHeight) {
                    let xgap = this.#fasten ? this.velXFast : this.velX;
                    
                    if (this.collisionCenterX < obs.collisionCenterX && dx <= attachWidth && dx >= attachWidth - xgap) {
                        console.log(`xgap:${xgap} dx:${dx} attachWidth:${attachWidth}`);
                        this.#rightBlock = true;
                        this.posX = obs.posX - this.spriteWidth;
                        dx = Math.abs(this.collisionCenterX - obs.collisionCenterX);
                        isBlock = true;
                    }

                    if (this.collisionCenterX > obs.collisionCenterX && dx <= attachWidth && dx >= attachWidth - xgap) {
                        console.log(`xgap:${xgap} dx:${dx} attachWidth:${attachWidth}`);
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
            })
        }

        checkBound() {
            let rate = this.#fasten ? this.fastFrameRate : this.frameRate;
            if (this.collisionCenterX > width / 2 - this.spriteWidth / 2) { // right border
                // let newStartPos = width / 2 - this.spriteWidth;
                // this.posX = Math.floor(newStartPos / rate) * rate;
                this.posX = width / 2 - this.spriteWidth
            } else if (this.collisionCenterX < - width / 2 + this.spriteWidth / 2) { // left border
                // let newStartPos = - width / 2;
                // this.posX = Math.ceil(newStartPos / rate) * rate;
                this.posX = - width / 2;
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
