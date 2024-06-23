import { AmbientLight } from 'three';

function createAmbientLight(color) {
    const ambient = new AmbientLight( color );
    return ambient;
}

export { createAmbientLight };