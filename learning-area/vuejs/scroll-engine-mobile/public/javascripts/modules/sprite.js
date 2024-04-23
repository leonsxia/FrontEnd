class Sprite {
    constructor(posX, posY, spriteWidth, spriteHeight, color, config) {
        this.posX = posX;
        this.posY = posY;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.notCollisionColor = color;
        this.spriteFrames = 0;
        this.config = config;
    }

    get collisionCenterX() {
        return this.posX + this.spriteWidth / 2;
    }

    get collisionCenterY() {
        return this.posY + this.spriteHeight / 2;
    }
}

export { Sprite };