import { Mesh, LineSegments } from 'three';

import { createGeometries } from './geometires';
import { createMaterials } from './materials';

function createMeshes() {
    const geometires = createGeometries();
    const materials = createMaterials();

    const cabin = new Mesh(geometires.cabin, materials.body);
    cabin.position.set(0, 1.3, -1.5);
    cabin.rotation.y = Math.PI / 2;

    const chimney = new Mesh(geometires.chimney, materials.detail);
    chimney.position.set(0, 1.8, 2);
    chimney.rotation.y = Math.PI / 2;

    const nose = new Mesh(geometires.nose, materials.body);
    nose.position.set(0, 1, 1);
    nose.rotation.z = Math.PI / 2;
    nose.rotation.y = Math.PI / 2;

    const smallWheelRear = new Mesh(geometires.wheel, materials.detail);
    smallWheelRear.position.y = 0.4;
    smallWheelRear.rotation.x = Math.PI / 2;
    smallWheelRear.rotation.z = Math.PI / 2;

    const smallWheelCenter = smallWheelRear.clone();
    smallWheelCenter.position.z = 1;

    const smallWheelFront = smallWheelRear.clone()
    smallWheelFront.position.z = 2;

    const bigWheel = smallWheelRear.clone();
    bigWheel.position.set(0, 0.8, -1.5);
    bigWheel.scale.set(2, 1.25, 2);

    const boundingBoxWire = new LineSegments(geometires.boundingBoxEdges, materials.boundingBoxWire);
    boundingBoxWire.name = 'boundingBoxWire';
    boundingBoxWire.position.set(0, 1.3, 0);
    boundingBoxWire.visible = true;
    boundingBoxWire.geometry.computeBoundingBox();

    const boundingBox = new Mesh(geometires.boundingBox, materials.boundingBox);
    boundingBox.name = 'boundingBox';
    boundingBox.position.set(0, 1.3, 0);
    boundingBox.visible = false;
    boundingBox.layers.enable(1);
    boundingBox.geometry.computeBoundingBox();

    const width = 1.5;
    const depth = 5;
    const height = 2.25;
    const Rl = 0.8; // big wheel radius
    const Rs = 0.5; // small wheel radius

    return { cabin, chimney, nose, smallWheelFront, smallWheelCenter, smallWheelRear, bigWheel,
        boundingBox, boundingBoxWire, width, depth, height, Rl, Rs
     };
}

export { createMeshes };