import { Sprite } from './sprite.js';

class Obstacle extends Sprite {
    constructor(position, size, color, type, config, isBuffer) {
        super(position[0], position[1], size[0], size[1], color, config);
        this.color = color;
        this.type = type;
        this.isBuffer = isBuffer;
    }

    draw() {
        // ctx.beginPath();
        switch (this.type) {
            case 'rectangle_stroke':
                this.config.ctx.strokeStyle = this.color;
                this.config.ctx.strokeRect(this.posX, this.posY, this.spriteWidth, this.spriteHeight);
                break;
            case 'rectangle_fill':
                this.config.ctx.fillStyle = this.color;
                this.config.ctx.fillRect(this.posX, this.posY, this.spriteWidth, this.spriteHeight);
        }
    }
}

export { Obstacle };