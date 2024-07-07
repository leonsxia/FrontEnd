import { MeshPhysicalMaterial } from 'three';

function createMaterials() {
    const body = new MeshPhysicalMaterial({
        color: 'firebrick',
        flatShading: true
    });

    const detail = new MeshPhysicalMaterial({
        color: 'darkslategray',
        flatShading: true
    });

    const boundingBox = new MeshPhysicalMaterial({
        color: '#dddddd',
        flatShading: true
    });

    return { body, detail, boundingBox };
}

export { createMaterials };