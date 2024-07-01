import { createAxesHelper, createGridHelper } from '../components/utils/helpers.js';
import { createBasicLights, createPointLights } from '../components/lights.js';
import { BirdsGroup } from '../components/composite/birds/Birds.js'
import { setupShadowLight } from '../components/shadowMaker.js';
import { makeFunctionGuiConfig, makeSceneRightGuiConfig } from '../components/utils/guiConfigHelper.js';
import { WorldScene } from './WorldScene.js';

const sceneName = 'Birds';
const worldSceneSpecs = {
    name: sceneName,
    camera: {
        position: [-1.5, 4.5, 6.5]
    },
    scene: {
        backgroundColor: 'lightblue'
    },
    enableGui: true,
    enableShadow: false
};
// basic lights
const mainLightCtlSpecs = {
    name: 'mainLight',
    display: 'Directional Light',
    detail: {
        color: [255, 255, 255],
        intensity: 2,
        position: [-10, 10, 10]
    },
    debug: true,
    shadow: false,
    visible: true
};
const pointLightCtlSpecs = {
    color: [204, 204, 204], // #cccccc
    position: [0, 0, 0],
    intensity: 50,
    distance: 0,    // infinity far
    decay: 1    // default 2
};
const ambientLightCtlSpecs = {
    name: 'ambientLight',
    display: 'Ambient Light',
    detail: {
        color: [128, 128, 128],
        intensity: 2
    },
    debug: true,
    visible: true
};
const hemisphereLightCtlSpecs = {
    name: 'hemisphereLight',
    display: 'Hemisphere Light',
    detail: {
        groundColor: [47, 79, 79],
        skyColor: [160, 160, 160],
        intensity: 3,
        position: [0, 1, 0] // light emit from top to bottom
    },
    debug: true,
    visible: true
};
const pointLightSpecsArr = [
    {
        name: 'cameraPointLight',
        display: 'Camera Point Light',
        detail: {
            color: [204, 204, 204], // #cccccc
            position: [0, 0, 0],
            intensity: 50,
            distance: 0,    // infinity far
            decay: 1    // default 2
        },
        debug: true,
        shadow: true,
        visible: true
    }
];
// axes, grid helper
const axesSpecs = {
    size: 3,
    position: [-10.5, 0, -10.5]
};
const gridSpecs = {
    size: 20,
    divisions: 20
}

class WorldScene3 extends WorldScene {
    #loadSequence = 0;
    #objects = [];
    #loaded = false;
    #basicLights = { mainLight: null, ambientLight: null, hemisphereLight: null };
    #pointLights = {};

    constructor(container, renderer, globalConfig, eventDispatcher) {
        Object.assign(worldSceneSpecs, globalConfig)
        super(container, renderer, worldSceneSpecs, eventDispatcher);

        this.#basicLights = createBasicLights(mainLightCtlSpecs, ambientLightCtlSpecs, hemisphereLightCtlSpecs);
        this.#pointLights = createPointLights(pointLightSpecsArr);

        this.camera.add(this.#pointLights['cameraPointLight']);

        
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(this.#basicLights.hemisphereLight,  this.camera, createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

        // shadow light setup, including light helper
        this.renderer.shadowMap.enabled = worldSceneSpecs.enableShadow;
        this.shadowLightObjects = setupShadowLight.call(this,
            this.scene, mainLightCtlSpecs, ...pointLightSpecsArr
        );

        if (worldSceneSpecs.enableGui) {
            const rightGuiConfig = makeSceneRightGuiConfig(
                mainLightCtlSpecs, ambientLightCtlSpecs, hemisphereLightCtlSpecs, 
                pointLightSpecsArr
            );

            Object.assign(rightGuiConfig.parents, this.#basicLights);
            Object.assign(rightGuiConfig.parents, this.#pointLights);
            this.guiRightSpecs = rightGuiConfig;
            // assgin left panel parents
            Object.assign(this.guiLeftSpecs.parents, {
                'actions': {
                    start: this.start.bind(this),
                    stop: this.stop.bind(this),
                    moveCamera: this.moveCamera.bind(this),
                    resetCamera: this.resetCamera.bind(this),
                    focusNext: this.focusNext.bind(this)
                }
            });
            this.guiLeftSpecs.details.push(makeFunctionGuiConfig('Actions', 'actions'));
            
            // bind callback to light helper and shadow cam helper
            this.bindLightShadowHelperGuiCallback();
        }
        return {
            name: this.name,
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
            return
        }
        const birdsSpecs = {
            models: [{
                src: 'assets/models/Parrot.glb',
                name: 'parrot',
                position: [0, 3, 2.5]
            }, {
                src: 'assets/models/Flamingo.glb',
                name: 'flamingo',
                position: [7.5, 3, -10]
            }, {
                src: 'assets/models/Stork.glb',
                name: 'stork',
                position: [0, 1.5, -10]
            }]
        };

        const birdsGroup = new BirdsGroup(birdsSpecs);
        birdsGroup.name = 'birdsGroup';
        this.#objects.push(birdsGroup);
        await birdsGroup.loadBirds();
        // move the target to the center of the front bird
        this.controls.defControl.target.copy(birdsGroup.getBirds(0).position);
        this.controls.defControl.update();
        this.controls.defControl.saveState();
        this.loop.updatables.push(birdsGroup);
        this.scene.add(birdsGroup);
        this.initContainer();
        this.#loaded = true;
    }

    focusNext() {
        // console.log(this.#loadSequence);
        const birdsGroup = this.#objects.find((obj) => obj.name === 'birdsGroup');
        const allTargets = birdsGroup.positions.concat([{x: 0, y: 0, z: 0}]);
        const allCameraPos = birdsGroup.getBirdsCamsPositions(5);
        allCameraPos.push({x: 20, y: 15, z: 20}); // the last view camera position
        
        this.#loadSequence = ++this.#loadSequence % allTargets.length;
        if (this.staticRendering) {
            this.controls.defControl.target.copy(allTargets[this.#loadSequence]);
            this.camera.position.copy(allCameraPos[this.#loadSequence]);
            this.controls.defControl.update();
        } else {
            const tar = this.controls.defControl.target;
            const pos = this.camera.position
            if (this.#loadSequence === 0) { // move to first position
                allTargets[allTargets.length - 1] = { x: tar.x, y: tar.y, z: tar.z };
                allCameraPos[allCameraPos.length - 1] = { x: pos.x, y: pos.y, z: pos.z };

                this.controls.focusNext(
                    allTargets[allTargets.length - 1], allTargets[0],
                    allCameraPos[allCameraPos.length - 1], allCameraPos[0]
                );
            } else { // move to next bird
                allTargets[this.#loadSequence - 1] = { x: tar.x, y: tar.y, z: tar.z };
                allCameraPos[this.#loadSequence - 1] = { x: pos.x, y: pos.y, z: pos.z };
                this.controls.focusNext(
                    allTargets[this.#loadSequence - 1], allTargets[this.#loadSequence],
                    allCameraPos[this.#loadSequence - 1], allCameraPos[this.#loadSequence]
                );
            }
        }
        
        this.controls.defControl.update();
    }
}

export { WorldScene3 };