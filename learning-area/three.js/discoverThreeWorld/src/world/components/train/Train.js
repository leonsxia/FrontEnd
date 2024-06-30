import { Group, MathUtils, Vector3 } from 'three';
import { createMeshes } from './meshes';
import { Moveable2D } from '../Moveable2D';

const wheelSpeed = MathUtils.degToRad(24);
class Train extends Moveable2D {
    constructor(name = '') {
        super();
        this.name = name;
        this.group = new Group();
        this.meshes = createMeshes();

        this.group.add(
            this.meshes.nose,
            this.meshes.cabin,
            this.meshes.chimney,
            this.meshes.smallWheelRear,
            this.meshes.smallWheelCenter,
            this.meshes.smallWheelFront,
            this.meshes.bigWheel
          );
    }

    tick(delta) {
        const R = 3;
        const Rl = 0.8;
        const Rs = 0.4;
        const vel = 5.55; // m/s
        const rotateVel = vel / R;
        const smallWheelRotateVel = vel / Rs;
        const largeWheelRotateVel = vel / Rl;
        const dist = vel * delta;
        let deltaVec3, deltaX, deltaZ; 
        if (this.isMovingForward) {
            deltaVec3 = new Vector3(0, 0, dist);
            this.group.position.copy(this.group.localToWorld(deltaVec3));
        } else if (this.isMovingBackward) {
            const deltaVec3 = new Vector3(0, 0, -dist);
            this.group.position.copy(this.group.localToWorld(deltaVec3));
        } else if (this.isMovingForwardLeft) {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            deltaVec3 = new Vector3(deltaX, 0, deltaZ);
            this.group.position.copy(this.group.localToWorld(deltaVec3));
            this.group.rotation.y += rotateVel * delta;
        } else if (this.isMovingForwardRight) {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            deltaVec3 = new Vector3(-deltaX, 0, deltaZ);
            this.group.position.copy(this.group.localToWorld(deltaVec3));
            this.group.rotation.y -= rotateVel * delta;
        } else if (this.isMovingBackwardLeft) {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            deltaVec3 = new Vector3(deltaX, 0, -deltaZ);
            this.group.position.copy(this.group.localToWorld(deltaVec3));
            this.group.rotation.y -= rotateVel * delta;
        } else if (this.isMovingBackwardRight) {
            deltaX = R - R * Math.cos(dist / R);
            deltaZ = R * Math.sin(dist / R);
            deltaVec3 = new Vector3(-deltaX, 0, -deltaZ);
            this.group.position.copy(this.group.localToWorld(deltaVec3));
            this.group.rotation.y += rotateVel * delta;
        } else if (this.isTurnClockwise) {
            this.group.rotation.y -= rotateVel * delta;
        } else if (this.isTurnCounterClockwise) {
            this.group.rotation.y += rotateVel * delta;
        }
        if (this.isForward) {
            this.meshes.bigWheel.rotation.x += delta * largeWheelRotateVel;
            this.meshes.smallWheelFront.rotation.x += delta * smallWheelRotateVel;
            this.meshes.smallWheelCenter.rotation.x += delta * smallWheelRotateVel;
            this.meshes.smallWheelRear.rotation.x += delta * smallWheelRotateVel;
        }else if (this.isBackward) {
            this.meshes.bigWheel.rotation.x -= delta * largeWheelRotateVel;
            this.meshes.smallWheelFront.rotation.x -= delta * smallWheelRotateVel;
            this.meshes.smallWheelCenter.rotation.x -= delta * smallWheelRotateVel;
            this.meshes.smallWheelRear.rotation.x -= delta * smallWheelRotateVel;
        }
    }
}

export { Train };