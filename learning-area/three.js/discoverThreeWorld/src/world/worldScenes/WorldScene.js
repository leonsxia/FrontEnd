import { createCamera } from '../components/camera.js';
import { createScene } from '../components/scene.js';
import { WorldControls } from '../systems/Controls.js';
import { Resizer } from '../systems/Resizer.js';
import { Loop } from '../systems/Loop.js';
import { Gui } from '../systems/Gui.js';
import { updateSingleLightCamera } from '../components/shadowMaker.js';
import { makeGuiPanel, makeDropdownGuiConfig } from '../components/utils/guiConfigHelper.js';

class WorldScene {
    name = 'default scene';
    camera = null;
    scene = null;
    renderer = null;
    loop = null;
    #resizer = null;
    controls = null;
    container = null;
    staticRendering = true;
    gui = null;
    guiRightSpecs = {};
    guiLeftSpecs = {};
    eventDispatcher;
    shadowLightObjects = [];

    constructor(container, renderer, specs, eventDispatcher) {
        this.name = specs.name;
        this.renderer = renderer;
        this.camera = createCamera(specs.camera);
        this.scene = createScene(specs.scene.backgroundColor);
        this.loop = new Loop(this.camera, this.scene, this.renderer);
        this.container = container;
        this.eventDispatcher = eventDispatcher;

        this.controls = new WorldControls(this.camera, this.renderer.domElement);

        this.controls.defControl.listenToKeyEvents(window);

        this.#resizer = new Resizer(container, this.camera, this.renderer);
        this.#resizer.onResize = 
        () => {
            this.render();
        };

        this.controls.defControl.addEventListener('change', () => {
            // important!!! no need to render after scene start to update automatically
            // increase the performance fps
            if (this.staticRendering) this.render();    
        });

        if (specs.enableGui) {
            this.gui = new Gui();
            this.controls.initPanels(this.gui);
            this.guiLeftSpecs = makeGuiPanel();
            this.guiLeftSpecs.details.push(makeDropdownGuiConfig(
                'Select World', 'selectWorld', 'scene', { scene: specs.name },
                specs.scenes, specs.changeCallback
            ));
        }
    }

    initContainer() {
        this.container.append(this.renderer.domElement);
        this.controls.defControl.enabled = true;
        if (this.gui) {
            this.gui.show();
            this.initGUIControl();
        }
    }

    initGUIControl() {
        this.gui.init({ attachedTo: this, left: this.guiLeftSpecs, right: this.guiRightSpecs });
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.staticRendering = false;
        this.controls.initPreCoordinates();
        this.controls.defControl.enableDamping = true;
        this.controls.defControl.dampingFactor = 0.1; // default 0.05
        this.loop.start(this.gui.stats);
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
        this.renderer.shadowMap.enabled = false;
        this.controls.resetCamera();
        this.controls.defControl.enabled = false;
        if (this.gui) {
            this.gui.hide();
            this.gui.reset();
        }
    }

    dispose() {
        // this.#renderer.dispose();
        // this.#renderer.forceContextLoss();
    }

    subscribeEvents(obj, moveType) {
        this.eventDispatcher.actions.forEach(action => {
            const callback = obj[action];
            if (callback) {
                const subscriber = {
                    subscriber: obj,
                    scene: this.name,
                    callback: callback
                }
                this.eventDispatcher.subscribe(moveType, action, subscriber);
            }
        });
    }

    bindLightShadowHelperGuiCallback() {
        // bind callback to light helper and shadow cam helper
        this.shadowLightObjects.forEach(lightObj => {
            const { specs } = this.guiRightSpecs.details.find(d => d.parent === lightObj.name);
            const changeObjs = specs.filter(s => s.hasOwnProperty('changeFn') && (s.type === 'light-num' || s.type === 'color' || s.type === 'groundColor'));
            changeObjs.forEach(o => {
                o['changeFn'] = updateSingleLightCamera.bind(this, lightObj, true);
            })
        });
    }
}

export { WorldScene };