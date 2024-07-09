import { BoxGeometry, EdgesGeometry } from 'three';

function createGeometries() {
    const body = new BoxGeometry(3, 6, 2);
    const slot = new BoxGeometry(1, 6, 1);
    const boundingBox = new BoxGeometry(3, 6, 3);
    const boundingBoxEdges = new EdgesGeometry(boundingBox);

    return { body, slot, boundingBox, boundingBoxEdges };
}

export { createGeometries };