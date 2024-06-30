import { Group } from 'three';
import { createMeshes } from './meshes';
import { Moveable2D } from '../Moveable2D';

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
        const radius = 3;
        const R = this.isAccelerating ? radius * 2.5 : radius;
        const Rl = 0.8;
        const Rs = 0.4;
        const vel = this.isAccelerating ? 13.89 : 5.55; // 50km/h - 20km/s
        const rotateVel = vel / R;
        const smallWheelRotateVel = vel / Rs;
        const largeWheelRotateVel = vel / Rl;
        const dist = vel * delta;
        const params = {
            group: this.group, R, rotateVel, dist, delta
        };
        this.tankmoveTick(params);

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