import { Object3D, Vector3 } from 'three';

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
        } else if (this.isTurnClockwise) {
            group.rotation.y -= rotateVel * delta;
        } else if (this.isTurnCounterClockwise) {
            group.rotation.y += rotateVel * delta;
        } else {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            if (this.isMovingForwardLeft) {
                deltaVec3 = new Vector3(deltaX, 0, deltaZ);
                group.position.copy(group.localToWorld(deltaVec3));
                group.rotation.y += rotateVel * delta;
            } else if (this.isMovingForwardRight) {
                deltaVec3 = new Vector3(-deltaX, 0, deltaZ);
                group.position.copy(group.localToWorld(deltaVec3));
                group.rotation.y -= rotateVel * delta;
            } else if (this.isMovingBackwardLeft) {
                deltaVec3 = new Vector3(deltaX, 0, -deltaZ);
                group.position.copy(group.localToWorld(deltaVec3));
                group.rotation.y -= rotateVel * delta;
            } else if (this.isMovingBackwardRight) {
                deltaVec3 = new Vector3(-deltaX, 0, -deltaZ);
                group.position.copy(group.localToWorld(deltaVec3));
                group.rotation.y += rotateVel * delta;
            }
        }
    }

    localToWorldBatch(object, positions) {
        positions.forEach(pos => {
            object.localToWorld(pos);
        });
    }

    tankmoveTickWithWall(params) {
        const { group, R, rotateVel, dist, delta, wall } = params;

        // set dummy object related to zero position.
        const dummyObject = new Object3D();
        dummyObject.position.copy(wall.worldToLocal(group.position.clone()));
        dummyObject.rotation.y = group.rotation.y - wall.rotationY;
        dummyObject.scale.copy(group.scale);

        let deltaVec3, deltaX, deltaZ;
        const leftCorVec3 = this.leftCorVec3;
        const rightCorVec3 = this.rightCorVec3;
        const leftBackCorVec3 = this.leftBackCorVec3;
        const rightBackCorVec3 = this.rightBackCorVec3;
        const boundries = [leftCorVec3, rightCorVec3, leftBackCorVec3, rightBackCorVec3];
        if (this.isMovingForward) {
            const deltaVec3 = new Vector3(0, 0, dist);
            const offsetVec3 = dummyObject.localToWorld(deltaVec3);
            this.localToWorldBatch(dummyObject, boundries);
            if (leftCorVec3.z <= 0) {
                const dirVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - leftCorVec3.z);
                dummyObject.position.copy(dirVec3);
            } else if (rightCorVec3.z <= 0) {
                const dirVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - rightCorVec3.z);
                dummyObject.position.copy(dirVec3);
            } else {
                dummyObject.position.copy(offsetVec3);
            }
        } else if (this.isMovingBackward) {
            const deltaVec3 = new Vector3(0, 0, - dist);
            const offsetVec3 = dummyObject.localToWorld(deltaVec3);
            this.localToWorldBatch(dummyObject, boundries);
            if (rightBackCorVec3.z <= 0) {
                const dirVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - rightBackCorVec3.z);
                dummyObject.position.copy(dirVec3);
            } else if (leftBackCorVec3.z <= 0) {
                const dirVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - leftBackCorVec3.z);
                dummyObject.position.copy(dirVec3);
            } else {
                dummyObject.position.copy(offsetVec3);
            }
        } else if (this.isTurnClockwise) {
            this.localToWorldBatch(dummyObject, boundries);
            if (leftCorVec3.z <= 0) {
                dummyObject.position.z = dummyObject.position.z - leftCorVec3.z;
            } else if (rightCorVec3.z <= 0) {
                dummyObject.position.z = dummyObject.position.z - rightCorVec3.z;
            } else if (leftBackCorVec3.z <= 0) {
                dummyObject.position.z = dummyObject.position.z - leftBackCorVec3.z;
            } else if (rightBackCorVec3.z <= 0) {
                dummyObject.position.z = dummyObject.position.z - rightBackCorVec3.z;
            }
            dummyObject.rotation.y -= rotateVel * delta;
        } else if (this.isTurnCounterClockwise) {
            this.localToWorldBatch(dummyObject, boundries);
            if (rightCorVec3.z <= 0) {
                dummyObject.position.z = dummyObject.position.z - rightCorVec3.z;
            } else if (leftCorVec3.z <= 0) {
                dummyObject.position.z = dummyObject.position.z - leftCorVec3.z;
            } else if (rightBackCorVec3.z <= 0) {
                dummyObject.position.z = dummyObject.position.z - rightBackCorVec3.z;
            } else if (leftBackCorVec3.z <= 0) {
                dummyObject.position.z = dummyObject.position.z - leftBackCorVec3.z;
            }
            dummyObject.rotation.y += rotateVel * delta;
        } else {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            if (this.isMovingForwardLeft || this.isMovingBackwardLeft) {
                deltaVec3 = this.isMovingForwardLeft ? new Vector3(deltaX, 0, deltaZ) : new Vector3(deltaX, 0, - deltaZ);
                const offsetVec3 = dummyObject.localToWorld(deltaVec3);
                dummyObject.position.copy(offsetVec3);
                dummyObject.rotation.y += this.isMovingForwardLeft ? rotateVel * delta : - rotateVel * delta;
                this.localToWorldBatch(dummyObject, boundries);
                if (rightCorVec3.z <= 0) {
                    const newVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - rightCorVec3.z);
                    dummyObject.position.copy(newVec3);
                } else if (leftCorVec3.z <= 0) {
                    const newVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - leftCorVec3.z);
                    dummyObject.position.copy(newVec3);
                } else if (rightBackCorVec3.z <= 0) {
                    const newVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - rightBackCorVec3.z);
                    dummyObject.position.copy(newVec3);
                } else if (leftBackCorVec3.z <= 0) {
                    const newVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - leftBackCorVec3.z);
                    dummyObject.position.copy(newVec3);
                }
            } else if (this.isMovingForwardRight || this.isMovingBackwardRight) {
                deltaVec3 = this.isMovingForwardRight ? new Vector3(- deltaX, 0, deltaZ) : new Vector3(- deltaX, 0, - deltaZ);
                const offsetVec3 = dummyObject.localToWorld(deltaVec3);
                dummyObject.position.copy(offsetVec3);
                dummyObject.rotation.y += this.isMovingForwardRight ? - rotateVel * delta : rotateVel * delta;
                this.localToWorldBatch(dummyObject, boundries);
                if (leftCorVec3.z <= 0) {
                    const newVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - leftCorVec3.z);
                    dummyObject.position.copy(newVec3);
                } else if (rightCorVec3.z <= 0) {
                    const newVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - rightCorVec3.z);
                    dummyObject.position.copy(newVec3);
                } else if (leftBackCorVec3.z <= 0) {
                    const newVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - leftBackCorVec3.z);
                    dummyObject.position.copy(newVec3);
                } else if (rightBackCorVec3.z <= 0) {
                    const newVec3 = new Vector3(offsetVec3.x, 0, dummyObject.position.z - rightBackCorVec3.z);
                    dummyObject.position.copy(newVec3);
                }
            }
        }
        group.position.copy(wall.localToWorld(dummyObject.position.clone()));
        group.rotation.y = dummyObject.rotation.y + wall.rotationY;
    }
}

export { Moveable2D };