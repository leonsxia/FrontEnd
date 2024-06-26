import { Train } from './components/Train/Train.js';
import { createAxesHelper, createGridHelper } from './components/helpers.js';
import { createLights } from './components/lights.js';
import { WorldScene } from './WorldScene.js';

const worldSceneSpecs = {
    camera: {
        position: [10, 10, 10]
    },
    scene: {
        backgroundColor: 'lightblue'
    }
}

class WorldScene2 extends WorldScene {
    #loaded = false;

    constructor(container, panels, renderer) {
        super(container, panels, renderer, worldSceneSpecs);

        const directLightSpecs = {
            color: 'white',
            intensity: 2,
            position: [-10, 10, 10]
        };
        const spotLightSpecs = {
            color: 0xffff00,
            position: [0, 0, 0],
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
            position: [0, 1, 0] // light emit from top to bottom
        };
        const { mainLight, pointLight, ambientLight, hemisphereLight } = createLights(directLightSpecs, spotLightSpecs, ambientLightSpecs, hemisphereLightSpecs);

        this.camera.add(pointLight);

        const axesSpecs = {
            size: 3,
            position: [-5.5, 0, -5.5]
        };
        const gridSpecs = {
            size: 10,
            divisions: 10
        }
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(mainLight, hemisphereLight, this.camera, createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

        return {
            renderer: this.renderer,
            init: this.init.bind(this), 
            render: this.render.bind(this),
            start: this.start.bind(this),
            stop: this.stop.bind(this),
            moveCamera: this.moveCamera.bind(this),
            resetCamera: this.resetCamera.bind(this),
            focusNext: this.focusNext.bind(this),
            reset: this.reset.bind(this),
            dispose: this.dispose.bind(this)
        };
    }

    async init() {
        if (this.#loaded) {
            this.initContainer();
            return;
        }
        const train = new Train();
        this.loop.updatables.push(train);
        this.scene.add(train);
        this.initContainer();
        this.#loaded = true;
    }
}

export { WorldScene2 };