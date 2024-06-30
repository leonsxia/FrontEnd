import { Vector3 } from 'three';

class Moveable2D {
    #movingLeft = false;
    #movingRight = false;
    #movingForward = false;
    #movingBackward = false;
    #accelerate = false;

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

    accelerate(val) {
        this.#accelerate = val;
        console.log(`[moveable2D]:accelerate ${this.#accelerate}`);
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

    get isAccelerating() {
        return this.#accelerate;
    }

    tankmoveTick(params) {
        const { group, R, rotateVel, dist, delta } = params;
        let deltaVec3, deltaX, deltaZ; 
        if (this.isMovingForward) {
            deltaVec3 = new Vector3(0, 0, dist);
            group.position.copy(group.localToWorld(deltaVec3));
        } else if (this.isMovingBackward) {
            const deltaVec3 = new Vector3(0, 0, -dist);
            group.position.copy(group.localToWorld(deltaVec3));
        } else if (this.isMovingForwardLeft) {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            deltaVec3 = new Vector3(deltaX, 0, deltaZ);
            group.position.copy(group.localToWorld(deltaVec3));
            group.rotation.y += rotateVel * delta;
        } else if (this.isMovingForwardRight) {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            deltaVec3 = new Vector3(-deltaX, 0, deltaZ);
            group.position.copy(group.localToWorld(deltaVec3));
            group.rotation.y -= rotateVel * delta;
        } else if (this.isMovingBackwardLeft) {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            deltaVec3 = new Vector3(deltaX, 0, -deltaZ);
            group.position.copy(group.localToWorld(deltaVec3));
            group.rotation.y -= rotateVel * delta;
        } else if (this.isMovingBackwardRight) {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            deltaVec3 = new Vector3(-deltaX, 0, -deltaZ);
            group.position.copy(group.localToWorld(deltaVec3));
            group.rotation.y += rotateVel * delta;
        } else if (this.isTurnClockwise) {
            group.rotation.y -= rotateVel * delta;
        } else if (this.isTurnCounterClockwise) {
            group.rotation.y += rotateVel * delta;
        }
    }
}

export { Moveable2D };