import { Train } from '../components/composite/train/Train.js';
import { createAxesHelper, createGridHelper } from '../components/utils/helpers.js';
import { createBasicLights, createPointLights } from '../components/lights.js';
import { setupShadowLight } from '../components/shadowMaker.js';
import { makeFunctionGuiConfig, makeSceneRightGuiConfig } from '../components/utils/guiConfigHelper.js';
import { WorldScene } from './WorldScene.js';

const sceneName = 'RunningTrain';
const worldSceneSpecs = {
    name: sceneName,
    camera: {
        position: [10, 10, 10]
    },
    scene: {
        backgroundColor: 'lightblue'
    },
    enableGui: true,
    moveType: 'tankmove',
    enableShadow: true
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
    shadow: true,
    visible: true
};
const ambientLightCtlSpecs = {
    name: 'ambientLight',
    display: 'Ambient Light',
    detail: {
        color: [128, 128, 128],
        intensity: 2
    },
    debug: false,
    visible: false
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
const pointLightSpecsArr = [];
// axes, grid helper
const axesSpecs = {
    size: 3,
    position: [-25.5, 0, -25.5]
};
const gridSpecs = {
    size: 50,
    divisions: 50
}

class WorldScene2 extends WorldScene {
    #loaded = false;
    #basicLights = { mainLight: null, ambientLight: null, hemisphereLight: null };
    #pointLights = {};

    constructor(container, renderer, globalConfig, eventDispatcher) {
        Object.assign(worldSceneSpecs, globalConfig)
        super(container, renderer, worldSceneSpecs, eventDispatcher);

        this.#basicLights = createBasicLights(mainLightCtlSpecs, ambientLightCtlSpecs, hemisphereLightCtlSpecs);
        this.#pointLights = createPointLights(pointLightSpecsArr);

        // this.camera.add(this.#pointLights['cameraSpotLight']);

        this.loop.updatables = [this.controls.defControl];
        this.scene.add(this.#basicLights.hemisphereLight, //this.camera, 
            createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

        // shadow light setup, including light helper
        this.renderer.shadowMap.enabled = worldSceneSpecs.enableShadow;
        this.shadowLightObjects = setupShadowLight.call(this,
            this.scene, mainLightCtlSpecs, hemisphereLightCtlSpecs, ...pointLightSpecsArr
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
        this.renderer.shadowMap.enabled = worldSceneSpecs.enableShadow;
        if (this.#loaded) {
            this.initContainer();
            return;
        }
        const train = new Train('red train');
        this.subscribeEvents(train, worldSceneSpecs.moveType);
        train.castShadow(true);
        train.receiveShadow(true);
        this.loop.updatables.push(train);
        this.scene.add(train.group);
        this.initContainer();
        this.#loaded = true;
    }
}

export { WorldScene2 };