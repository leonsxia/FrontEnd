import { PerspectiveCamera } from 'three'

function createCamera(spc) {
    const camera = new PerspectiveCamera(
        35, // fov = Field of View
        1,  // aspect ratio
        0.1,    // near clipping plane
        150     // far clipping plane
    );

    // move the camera back so we can view the scene
    camera.position.set(...spc.position);

    return camera;
}

export { createCamera };