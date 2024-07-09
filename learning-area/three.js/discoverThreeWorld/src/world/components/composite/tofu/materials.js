import { MeshPhysicalMaterial, LineBasicMaterial } from 'three';

function createMaterials() {
    const boundingBox = new LineBasicMaterial({
        color: '#00ff00'
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