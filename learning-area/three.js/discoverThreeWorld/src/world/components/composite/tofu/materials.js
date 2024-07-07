import { MeshPhysicalMaterial } from 'three';

function createMaterials() {
    const boundingBox = new MeshPhysicalMaterial({
        color: '#dddddd',
        flatShading: true
    });

    const body = new MeshPhysicalMaterial({
        color: '#cccccc',
        flatShading: true
    });

    const slot = new MeshPhysicalMaterial({
        color: '#aaaaaa',
        flatShading: true
    });

    return { body, slot, boundingBox };
}

export { createMaterials };