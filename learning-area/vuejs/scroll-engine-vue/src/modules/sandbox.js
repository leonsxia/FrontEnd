class Sandbox {
    averageFrames = 0;
    start = undefined;
    preTimeStamp;
    prestamp;
    frames = 0;
    #showTestingLines = true;

    constructor(player, obstacles, scrollEngine, config) {
        this.player = player;
        this.obstacles = obstacles;
        this.scrollEngine = scrollEngine;
        this.config = config;
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

        if (elapsed < this.config.msPerFrame) {
            window.requestAnimationFrame(this.run.bind(this));
            return
        }
        this.frames++;
        const excessTime = elapsed % this.config.msPerFrame;
        this.preTimeStamp = timestamp - excessTime;
        // console.log(`timestamp: ${timestamp} elapsed: ${elapsed} excessTime: ${excessTime} pretimestamp: ${this.preTimeStamp} this.frames*msPerFrame: ${this.frames * msPerFrame}`);

        // clear screen
        this.config.ctx.fillStyle = '#222';
        this.config.ctx.fillRect(- this.config.width / 2, - 3 * this.config.height / 4, this.config.width, this.config.height);

        // title
        this.config.ctx.strokeStyle = 'white';
        this.config.ctx.lineWidth = 1;
        this.config.ctx.font = '18px arial';
        this.config.ctx.strokeText('Scroll Engine Test', - this.config.width / 2 + 10, - 3 * this.config.height / 4 + 36);

        // fps
        this.config.ctx.strokeStyle = 'yellow';
        this.config.ctx.lineWidth = 1;
        this.config.ctx.font = '18px sans-serif';
        this.config.ctx.strokeText(`FPS: ${this.averageFrames.toFixed(2)}`, this.config.width / 2 - 100, - 3 * this.config.height / 4 + 36);

        this.obstacles.forEach(obs => {
            obs.draw();
        })
        this.player.draw();
        this.player.checkMovement();
        this.player.collisionDetect(this.obstacles);
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
            this.config.ctx.beginPath();
            this.config.ctx.strokeStyle = 'rgba(255, 255, 0, 0.2)';
            this.config.ctx.setLineDash([5, 5]);
            // ctx.moveTo(centerLeft, - 3 * height / 4);
            // ctx.lineTo(centerLeft, height / 4);
            // ctx.stroke();
            // ctx.moveTo(centerRight, - 3 * height / 4);
            // ctx.lineTo(centerRight, height / 4);
            this.config.ctx.moveTo(this.config.centerLineX, - 3 * this.config.height / 4);
            this.config.ctx.lineTo(this.config.centerLineX, this.config.height / 4);
            this.config.ctx.stroke();
            this.config.ctx.moveTo(this.config.leftScrollLeft, - 3 * this.config.height / 4);
            this.config.ctx.lineTo(this.config.leftScrollLeft, this.config.height / 4);
            this.config.ctx.stroke();
            this.config.ctx.moveTo(this.config.leftScrollRight, - 3 * this.config.height / 4);
            this.config.ctx.lineTo(this.config.leftScrollRight, this.config.height / 4);
            this.config.ctx.stroke();
            this.config.ctx.setLineDash([]);
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

export { Sandbox };