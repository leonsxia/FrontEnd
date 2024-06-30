import { Mesh } from 'three';

import { createGeometries } from './geometires';
import { createMaterials } from './materials';

function createMeshes() {
    const geometires = createGeometries();
    const materials = createMaterials();

    const cabin = new Mesh(geometires.cabin, materials.body);
    cabin.position.set(0, 1.4, -1.5);
    cabin.rotation.y = Math.PI / 2;

    const chimney = new Mesh(geometires.chimney, materials.detail);
    chimney.position.set(0, 1.9, 2);
    chimney.rotation.y = Math.PI / 2;

    const nose = new Mesh(geometires.nose, materials.body);
    nose.position.set(0, 1, 1);
    nose.rotation.z = Math.PI / 2;
    nose.rotation.y = Math.PI / 2;

    const smallWheelRear = new Mesh(geometires.wheel, materials.detail);
    smallWheelRear.position.y = 0.5;
    smallWheelRear.rotation.x = Math.PI / 2;
    smallWheelRear.rotation.z = Math.PI / 2;

    const smallWheelCenter = smallWheelRear.clone();
    smallWheelCenter.position.z = 1;

    const smallWheelFront = smallWheelRear.clone()
    smallWheelFront.position.z = 2;

    const bigWheel = smallWheelRear.clone();
    bigWheel.position.set(0, 0.9, -1.5);
    bigWheel.scale.set(2, 1.25, 2);

    return { cabin, chimney, nose, smallWheelFront, smallWheelCenter, smallWheelRear, bigWheel };
}

export { createMeshes };