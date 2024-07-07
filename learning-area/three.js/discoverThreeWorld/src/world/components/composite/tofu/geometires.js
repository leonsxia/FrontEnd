import { BoxGeometry } from 'three';

function createGeometries() {
    const body = new BoxGeometry(3, 6, 2);
    const slot = new BoxGeometry(1, 6, 1);
    const boundingBox = new BoxGeometry(3, 6, 3);

    return { body, slot, boundingBox };
}

export { createGeometries };