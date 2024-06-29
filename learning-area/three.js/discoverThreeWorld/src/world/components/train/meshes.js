import { Mesh } from 'three';

import { createGeometries } from './geometires';
import { createMaterials } from './materials';

function createMeshes() {
    const geometires = createGeometries();
    const materials = createMaterials();

    const cabin = new Mesh(geometires.cabin, materials.body);
    cabin.position.set(1.5, 1.4, 0);

    const chimney = new Mesh(geometires.chimney, materials.detail);
    chimney.position.set(-2, 1.9, 0);

    const nose = new Mesh(geometires.nose, materials.body);
    nose.position.set(-1, 1, 0);
    nose.rotation.z = Math.PI / 2;

    const smallWheelRear = new Mesh(geometires.wheel, materials.detail);
    smallWheelRear.position.y = 0.5;
    smallWheelRear.rotation.x = Math.PI / 2;

    const smallWheelCenter = smallWheelRear.clone();
    smallWheelCenter.position.x = -1;

    const smallWheelFront = smallWheelRear.clone()
    smallWheelFront.position.x = -2;

    const bigWheel = smallWheelRear.clone();
    bigWheel.position.set(1.5, 0.9, 0);
    bigWheel.scale.set(2, 1.25, 2);

    return { cabin, chimney, nose, smallWheelFront, smallWheelCenter, smallWheelRear, bigWheel };
}

export { createMeshes };