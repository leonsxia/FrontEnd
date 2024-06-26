import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { createCamera } from './components/camera.js';
import { createScene } from './components/scene.js';

import { WorldControls } from './systems/Controls.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

class WorldScene {
    camera = null;
    scene = null;
    renderer = null;
    loop = null;
    #resizer = null;
    controls = null;
    container = null;
    staticRendering = true;
    gui = new GUI();

    constructor(container, panels, renderer, specs) {
        this.renderer = renderer;
        this.camera = createCamera(specs.camera);
        this.scene = createScene(specs.scene.backgroundColor);
        this.loop = new Loop(this.camera, this.scene, this.renderer);
        this.container = container;

        this.controls = new WorldControls(this.camera, this.renderer.domElement);
        this.controls.initPanels(panels);

        // this.#controls.target.copy(earth.mesh.position);
        // this.#controls.enablePan = false;
        this.controls.defControl.listenToKeyEvents(window);

        this.#resizer = new Resizer(container, this.camera, this.renderer);
        this.#resizer.onResize = 
        () => {
            this.render();
        };

        this.controls.defControl.addEventListener('change', () => this.render());
    }

    initContainer() {
        this.container.append(this.renderer.domElement);
        this.controls.defControl.enabled = true;
        this.gui.show();
        this.initGUIControl();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.staticRendering = false;
        this.controls.initPreCoordinates();
        this.controls.defControl.enableDamping = true;
        this.controls.defControl.dampingFactor = 0.1; // default 0.05
        this.loop.start();
    }

    stop() {
        this.staticRendering = true;
        this.controls.defControl.enableDamping = false;
        this.loop.stop();
    }

    update() {
        this.scene.children.forEach((object) => {
            object.rotation.y += 0.0025;
        })
        this.render();
        window.requestAnimationFrame(this.update.bind(this));
    }

    moveCamera() {
        const moveDist = 5;
        if (this.staticRendering) {
            this.controls.moveCameraStatic(moveDist);
        } else {
            this.controls.moveCamera(moveDist);
        }
    }

    resetCamera() {
        this.controls.resetCamera();
    }

    focusNext() {}

    reset() {
        this.stop();
        this.controls.resetCamera();
        this.controls.defControl.enabled = false;
        this.gui.hide();
        this.gui.reset();
    }

    dispose() {
        // this.#renderer.dispose();
        // this.#renderer.forceContextLoss();
    }
}

export { WorldScene };