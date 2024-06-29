class Moveable2D {
    #movingLeft = false;
    #movingRight = false;
    #movingForward = false;
    #movingBackward = false;

    constructor() {
    }

    movingLeft(val) {
        this.#movingLeft = val;
        console.log(`[moveable2D]:movingLeft ${this.#movingLeft}`);
    }

    movingRight(val) {
        this.#movingRight = val;
        console.log(`[moveable2D]:movingRight ${this.#movingRight}`);
    }

    movingForward(val) {
        this.#movingForward = val;
        console.log(`[moveable2D]:movingForward ${this.#movingForward}`);
    }

    movingBackward(val) {
        this.#movingBackward = val;
        console.log(`[moveable2D]:movingBackward ${this.#movingBackward}`);
    }

    get isForward() {
        return this.isMovingForward || this.isMovingForwardLeft || this.isMovingForwardRight;
    }

    get isBackward() {
        return this.isMovingBackward || this.isMovingBackwardLeft || this.isMovingBackwardRight;
    }

    get isTurnCounterClockwise() {
        return this.#movingLeft && !this.#movingForward && !this.#movingBackward;
    }

    get isTurnClockwise() {
        return this.#movingRight && !this.#movingForward && !this.#movingBackward;
    }

    get isMovingForward() {
        return  this.#movingForward && !this.#movingLeft && !this.#movingRight;
    }

    get isMovingBackward() {
        return this.#movingBackward && !this.#movingLeft && !this.#movingRight;
    }

    get isMovingForwardLeft() {
        return this.#movingForward && this.#movingLeft;
    }

    get isMovingForwardRight() {
        return this.#movingForward && this.#movingRight;
    }

    get isMovingBackwardLeft() {
        return this.#movingBackward && this.#movingLeft;
    }

    get isMovingBackwardRight() {
        return this.#movingBackward && this.#movingRight;
    }
}

export { Moveable2D };