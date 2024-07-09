import { MeshPhysicalMaterial, LineBasicMaterial } from 'three';

function createMaterials() {
    const body = new MeshPhysicalMaterial({
        color: 'firebrick',
        flatShading: true
    });

    const detail = new MeshPhysicalMaterial({
        color: 'darkslategray',
        flatShading: true
    });

    const boundingBox = new LineBasicMaterial({
        color: '#00ff00'
    });

    return { body, detail, boundingBox };
}

export { createMaterials };