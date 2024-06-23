import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { Earth } from './components/Earth.js';
import { createSphere } from './components/sphere.js';
import { createLights } from './components/lights.js';
import { createAmbientLight } from './components/ambientLight.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';

// These variables are module-scoped: we cannot access them
// from outside the module
// let camera;
// let renderer;
// let scene;

class World {
    #camera = null;
    #scene = null;
    #renderer = null
    // 1. Create an instance of the World app   
    constructor(container) {
        this.#camera = createCamera();
        this.#scene = createScene();
        this.#renderer = createRenderer();
        container.append(this.#renderer.domElement);

        const cube = createCube({color: 'green'});
        cube.rotation.set(0.25, -0.25, 0);
        cube.position.set(-2.5, 0, 0);

        const earthSpecs = {
            surfaceMap: 'images/earth_surface_2048.jpg',
            normalMap: 'images/earth_normal_2048.jpg',
            specularMap: 'images/earth_specular_2048.jpg'
        }
        // const earth = new Earth(earthSpecs);
        // earth.setPosition({x:2, y:0, z:0});

        const sphere = createSphere({color: '#ff0000'});
        sphere.position.set(2, 0, 0);

        const light = createLights();
        const ambient = createAmbientLight(0x505050);

        this.#scene.add(cube, sphere, light, ambient);

        const resizer = new Resizer(container, this.#camera, this.#renderer);
    }

    // 2. Render the scene
    render() {
        this.#renderer.render(this.#scene, this.#camera);
    }

    update() {
        this.render();
        requestAnimationFrame(this.update.bind(this));
    }
}

export { World };