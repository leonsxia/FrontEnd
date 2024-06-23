const setSize = (container, camera, renderer) => {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;

    // Update the camera's frustum
    camera.updateProjectionMatrix();

    // Update the size of the renderer and the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
  };

class Resizer {
    constructor(container, camera, renderer) {
        // set initial size on load
        setSize(container, camera, renderer);

        window.addEventListener('resize', () => {
            setSize(container, camera, renderer);
            this.onResize();
        });
    }

    onResize() {}
}

export { Resizer };