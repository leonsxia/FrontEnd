const setSize = (container, camera, renderer) => {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;

    // Update the camera's frustum
    camera.updateProjectionMatrix();

    // Set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);

    // Update the size of the renderer and the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);
    // renderer.domElement.style.width = `${container.clientWidth}px`;
    // renderer.domElement.style.height = `${container.clientHeight}px`;
    // renderer.setScissorTest(true);
    // renderer.setScissor(0, 0, container.clientWidth / 2, container.clientHeight / 2);
    // renderer.setViewport(0, 0, container.clientWidth / 2, container.clientHeight / 2);
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