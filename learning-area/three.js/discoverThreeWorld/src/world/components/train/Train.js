import { Group, MathUtils } from 'three';
import { createMeshes } from './meshes';    

const wheelSpeed = MathUtils.degToRad(24);
class Train extends Group {
    constructor() {
        super();
        this.meshes = createMeshes();

        this.add(
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
        this.meshes.bigWheel.rotation.y += delta * wheelSpeed;
        this.meshes.smallWheelFront.rotation.y += delta * wheelSpeed;
        this.meshes.smallWheelCenter.rotation.y += delta * wheelSpeed;
        this.meshes.smallWheelRear.rotation.y += delta * wheelSpeed;
    }
}

export { Train };