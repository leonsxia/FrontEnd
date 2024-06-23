import { PerspectiveCamera } from 'three'

function createCamera(spc) {
    const camera = new PerspectiveCamera(
        35, // fov = Field of View
        1,  // aspect ratio
        0.1,    // near clipping plane
        100     // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(spc.position.x, spc.position.y, spc.position.z);

    return camera;
}

export { createCamera };