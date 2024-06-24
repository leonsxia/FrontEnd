import { createCamera } from './components/camera.js';
import { Train } from './components/Train/Train.js';
import { createAxesHelper, createGridHelper } from './components/helpers.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { WorldControls } from './systems/Controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

class WorldScene2 {
    #camera = null;
    #scene = null;
    #renderer = null;
    #loop = null;
    #resizer = null;
    #controls = null;
    #cameraPos = {x: 10, y: 10, z: 10};
    #staticRendering = true;
    #loaded = false;
    #container = null;

    constructor(container, panels) {
        const cameraSpecs = {
            position: this.#cameraPos
        }
        this.#camera = createCamera(cameraSpecs);
        this.#scene = createScene('lightblue');
        this.#renderer = createRenderer();
        this.#loop = new Loop(this.#camera, this.#scene, this.#renderer);
        // container.append(this.#renderer.domElement);
        this.#container = container;

        this.#controls = new WorldControls(this.#camera, this.#renderer.domElement);
        this.#controls.initPanels(panels);

        const directLightSpecs = {
            color: 'white',
            intensity: 2,
            position: {
                x: -10,
                y: 10,
                z: 10
            }
        };
        const spotLightSpecs = {
            color: 0xffff00,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            intensity: 50,
            distance: 0,    // infinity far
            decay: 1    // default 2
        };
        const ambientLightSpecs = {
            color: 0x808080,
            intensity: 2
        };
        const hemisphereLightSpecs = {
            skyColor: 0xa0a0a0,
            groundColor: 'darkslategrey',
            intensity: 3,
            position: { // light emit from top to bottom
                x: 0,
                y: 1,
                z: 0
            }
        };
        const { mainLight, pointLight, ambientLight, hemisphereLight } = createLights(directLightSpecs, spotLightSpecs, ambientLightSpecs, hemisphereLightSpecs);

        this.#camera.add(pointLight);

        const axesSpecs = {
            size: 3,
            position: {
                x: -5.5,
                y: 0,
                z: -5.5
            }
        };
        const gridSpecs = {
            size: 10,
            divisions: 10
        }
        this.#loop.updatables = [this.#controls.defControl];
        this.#scene.add(mainLight, hemisphereLight, this.#camera, createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

        this.#resizer = new Resizer(container, this.#camera, this.#renderer);
        this.#resizer.onResize =
        () => {
            this.render();
        };

        this.#controls.defControl.addEventListener('change', () => this.render());
    }

    async init() {
        this.#container.append(this.#renderer.domElement);
        if (this.#loaded) {
            return
        }
        const train = new Train();
        this.#loop.updatables.push(train);
        this.#scene.add(train);
        this.#loaded = true;
    }

    render() {
        this.#renderer.render(this.#scene, this.#camera);
    }

    start() {
        this.#staticRendering = false;
        this.#controls.initPreCoordinates();
        this.#controls.defControl.enableDamping = true;
        this.#controls.defControl.dampingFactor = 0.1; // default 0.05
        this.#loop.start();
    }

    stop() {
        this.#staticRendering = true;
        this.#controls.defControl.enableDamping = false;
        this.#loop.stop();
    }

    moveCamera() {
        const moveDist = 5;
        if (this.#staticRendering) {
            this.#controls.moveCameraStatic(moveDist);
        } else {
            this.#controls.moveCamera(moveDist);
        }
    }

    resetCamera() {
        this.#controls.resetCamera();
    }

    focusNext() {}

    reset() {
        this.stop();
        this.#controls.resetCamera();
    }

    dispose() {
        // this.#renderer.dispose();
        // this.#renderer.forceContextLoss();
    }
}

export { WorldScene2 };