import { createCamera } from './components/camera.js';
import { createAxesHelper, createGridHelper } from './components/helpers.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { BirdsGroup } from './components/birds/Birds.js'

import { WorldControls } from './systems/Controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

class WorldScene3 {
    #camera = null;
    #scene = null;
    #renderer = null;
    #loop = null;
    #resizer = null;
    #controls = null;
    #loadSequence = 0;
    #cameraPos = {x: -1.5, y: 4.5, z: 6.5};
    #staticRendering = true;
    #objects = [];
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
            color: 0xcccccc,
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
                x: -10.5,
                y: 0,
                z: -10.5
            }
        };
        const gridSpecs = {
            size: 20,
            divisions: 20
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
        const birdsSpecs = {
            models: [{
                src: 'assets/models/Parrot.glb',
                name: 'parrot',
                position: { x: 0, y: 3, z: 2.5 }
            }, {
                src: 'assets/models/Flamingo.glb',
                name: 'flamingo',
                position: { x: 7.5, y: 3, z: -10 }
            }, {
                src: 'assets/models/Stork.glb',
                name: 'stork',
                position: { x: 0, y: 1.5, z: -10 }
            }]
        };

        const birdsGroup = new BirdsGroup(birdsSpecs);
        birdsGroup.name = 'birdsGroup';
        this.#objects.push(birdsGroup);
        await birdsGroup.loadBirds();
        // move the target to the center of the front bird
        this.#controls.defControl.target.copy(birdsGroup.getBirds(0).position);
        this.#controls.defControl.update();
        this.#controls.defControl.saveState();
        this.#loop.updatables.push(birdsGroup);
        this.#scene.add(birdsGroup);
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

    focusNext() {
        // console.log(this.#loadSequence);
        const birdsGroup = this.#objects.find((obj) => obj.name === 'birdsGroup');
        const allTargets = birdsGroup.positions.concat({x: 0, y: 0, z: 0});
        const allCameraPos = birdsGroup.getBirdsCamsPositions(5);
        allCameraPos.push({x: 20, y: 15, z: 20}); // the last view camera position
        
        if (++this.#loadSequence === allTargets.length) {
            this.#loadSequence = 0;
        }
        if (this.#staticRendering) {
            this.#controls.defControl.target.copy(allTargets[this.#loadSequence]);
            this.#camera.position.copy(allCameraPos[this.#loadSequence]);
            this.#controls.defControl.update();
        } else {
            if (this.#loadSequence === 0) { // move to first position
                allTargets[allTargets.length - 1] = { x: this.#controls.defControl.target.x, y: this.#controls.defControl.target.y, z: this.#controls.defControl.target.z };
                allCameraPos[allCameraPos.length - 1] = { x: this.#camera.position.x, y: this.#camera.position.y, z: this.#camera.position.z };

                this.#controls.focusNext(
                    allTargets[allTargets.length - 1], allTargets[0],
                    allCameraPos[allCameraPos.length - 1], allCameraPos[0]
                );
            } else { // move to next bird
                allTargets[this.#loadSequence - 1] = { x: this.#controls.defControl.target.x, y: this.#controls.defControl.target.y, z: this.#controls.defControl.target.z };
                allCameraPos[this.#loadSequence - 1] = { x: this.#camera.position.x, y: this.#camera.position.y, z: this.#camera.position.z };
                this.#controls.focusNext(
                    allTargets[this.#loadSequence - 1], allTargets[this.#loadSequence],
                    allCameraPos[this.#loadSequence - 1], allCameraPos[this.#loadSequence]
                );
            }
        }
        
        this.#controls.defControl.update();
    }

    reset() {
        this.stop();
        this.#controls.resetCamera();
    }

    dispose() {
        // this.#renderer.dispose();
        // this.#renderer.forceContextLoss();
    }
}

export { WorldScene3 };