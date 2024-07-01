import { MeshStandardMaterial } from 'three';

function createBasicMaterials() {
    const basic = new MeshStandardMaterial({ color: '#999999' });

    return { basic };
}

export { createBasicMaterials };