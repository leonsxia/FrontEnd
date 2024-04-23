class ScrollEngine {
    #fasten;
    #AkeyDown = false;
    #DKeyDown = false;
    #lockScroll = false;

    constructor(player, obstacles, config) {
        this.player = player;
        this.obstacles = obstacles;
        this.scrollDirection = 'left';
        this.scrollIsMoving = false;
        this.scrollVelX = 1;
        this.scrollFastVelX = 3;
        this.config = config;
    }

    get isMoving() {
        return this.player.enableScroll && !this.player.isBlockHorizontal //&& (!player.isInAir || (player.isInAir && player.isFalling))
        && ((!this.player.isAtBuffer && !this.#lockScroll
        && ((this.player.isAtLeftScrollLine && this.#AkeyDown) 
            || (this.player.isAtRightSection && this.#DKeyDown)))
            || ((this.player.isAtLeftBorder && this.#AkeyDown)
            || (this.player.isAtRightBorder && this.#DKeyDown)));
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
                    if (player.bottomY === this.config.groundLevel || (!player.jump && player.velG > 0 && player.jumpTimes < player.topJumpTimes)) {
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
                    obs.posX -= this.#fasten ? this.config.velFactor * this.scrollFastVelX : this.config.velFactor * this.scrollVelX;
                });
                // console.log('scroll is moving left.');
            } else {
                this.obstacles.forEach(obs => {
                    obs.posX += this.#fasten ? this.config.velFactor * this.scrollFastVelX : this.config.velFactor * this.scrollVelX;
                });
                // console.log('scroll is moving right');
            }
        } else {
            // console.log('scroll stopped.');
        }
    }
}

export { ScrollEngine };