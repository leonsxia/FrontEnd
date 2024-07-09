import { MeshPhysicalMaterial, LineBasicMaterial, MeshBasicMaterial } from 'three';

function createMaterials() {
    const boundingBoxWire = new LineBasicMaterial({
        color: '#00ff00'
    });

    const boundingBox = new MeshBasicMaterial({
        color: '#ffffff'
    });

    const body = new MeshPhysicalMaterial({
        color: '#cccccc',
        flatShading: true
    });

    const slot = new MeshPhysicalMaterial({
        color: '#aaaaaa',
        flatShading: true
    });

    return { body, slot, boundingBox, boundingBoxWire };
}

export { createMaterials };