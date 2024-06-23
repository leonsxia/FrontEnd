import { DirectionalLight, PointLight } from 'three';

function createLights() {
    const light = new DirectionalLight('white', 8);
    const pointLight = new PointLight(0xffffff, 5, 100, 0);
    pointLight.position.set(-10, 0, 20);

    // move the light right, up and towards us
    light.position.set(10, 10, 10);

    return pointLight;
}

export { createLights };