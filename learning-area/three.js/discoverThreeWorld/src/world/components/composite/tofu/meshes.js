import { Mesh } from 'three';

import { createGeometries } from './geometires';
import { createMaterials } from './materials';

function createMeshes() {
    const geometires = createGeometries();
    const materials = createMaterials();

    const body = new Mesh(geometires.body, materials.body);
    body.name = 'body';
    body.position.set(0, 3, -0.5);

    const slotLeft = new Mesh(geometires.slot, materials.slot);
    slotLeft.name = 'slotLeft';
    slotLeft.position.set(1, 3, 1);

    const slotRight = slotLeft.clone();
    slotRight.name = 'slotRight'
    slotRight.position.set(-1, 3, 1);

    const boundingBox = new Mesh(geometires.boundingBox, materials.boundingBox);
    boundingBox.name = 'boundingBox';
    boundingBox.position.set(0, 3, 0);
    boundingBox.visible = false;
    boundingBox.geometry.computeBoundingBox();

    const width = 3;
    const depth = 3;
    const height = 6;

    return { body, slotLeft, slotRight, boundingBox, width, depth, height };
}

export { createMeshes };