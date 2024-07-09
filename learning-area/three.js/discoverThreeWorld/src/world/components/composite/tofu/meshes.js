import { Mesh, LineSegments } from 'three';

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

    const boundingBoxWire = new LineSegments(geometires.boundingBoxEdges, materials.boundingBoxWire);
    boundingBoxWire.name = 'boundingBoxWire';
    boundingBoxWire.position.set(0, 3, 0);
    boundingBoxWire.visible = true;
    boundingBoxWire.geometry.computeBoundingBox();

    const boundingBox = new Mesh(geometires.boundingBox, materials.boundingBox);
    boundingBox.name = 'boundingBox';
    boundingBox.position.set(0, 3, 0);
    boundingBox.visible = false;
    boundingBox.layers.enable(1);
    boundingBox.geometry.computeBoundingBox();

    const width = 3;
    const depth = 3;
    const height = 6;

    return { body, slotLeft, slotRight, boundingBox, boundingBoxWire, width, depth, height };
}

export { createMeshes };