import { Train } from '../components/composite/train/Train.js';
import { createAxesHelper, createGridHelper } from '../components/helpers.js';
import { createLights } from '../components/lights.js';
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
    moveType: 'tankmove'
};
const mainLightCtlSpecs = {
    color: [255, 255, 255],
    intensity: 2,
    position: [-10, 10, 10]
};
const pointLightCtlSpecs = {
    color: [255, 255, 0],
    position: [0, 0, 0],
    intensity: 50,
    distance: 0,    // infinity far
    decay: 1    // default 2
};
const ambientLightCtlSpecs = {
    color: [128, 128, 128],
    intensity: 2
};
const hemisphereLightCtlSpecs = {
    groundColor: [47, 79, 79],
    skyColor: [160, 160, 160],
    intensity: 3,
    position: [0, 1, 0] // light emit from top to bottom
};

const guiRightSpecs = {
    parents: {},
    details: [{
        folder: 'Directional Light',
        parent: 'mainLight',
        specs: [{
            name: 'intensity',
            value: null,
            params: [0, 20],
            type: 'number'
        }, {
            name: 'color',
            value: mainLightCtlSpecs,
            params: [255],
            type: 'color'
        }]
    }, {
        folder: 'Point Light',
        parent: 'pointLight',
        specs: [{
            name: 'intensity',
            value: null,
            params: [0, 50],
            type: 'number'
        }, {
            name: 'color',
            value: pointLightCtlSpecs,
            params: [255],
            type: 'color'
        }]
    }, {
        folder: 'Hemisphere Light',
        parent: 'hemisphereLight',
        specs: [{
            name: 'intensity',
            value: null,
            params: [0, 50],
            type: 'number'
        }, {
            name: 'skyColor',
            value: hemisphereLightCtlSpecs,
            params: [255],
            type: 'color'
        }, {
            name: 'groundColor',
            value: hemisphereLightCtlSpecs,
            params: [255],
            type: 'groundColor'
        }]
    }]
};

class WorldScene2 extends WorldScene {
    #loaded = false;
    #lights = { mainLight: null, pointLight: null, ambientLight: null, hemisphereLight: null };

    constructor(container, renderer, globalConfig, eventDispatcher) {
        Object.assign(worldSceneSpecs, globalConfig)
        super(container, renderer, worldSceneSpecs, eventDispatcher);

        this.#lights = createLights(mainLightCtlSpecs, pointLightCtlSpecs, ambientLightCtlSpecs, hemisphereLightCtlSpecs);

        this.camera.add(this.#lights.pointLight);

        const axesSpecs = {
            size: 3,
            position: [-25.5, 0, -25.5]
        };
        const gridSpecs = {
            size: 50,
            divisions: 50
        }
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(this.#lights.mainLight, this.#lights.hemisphereLight, this.camera, createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

        if (worldSceneSpecs.enableGui) {
            guiRightSpecs.parents = this.#lights;
            this.guiRightSpecs = guiRightSpecs;
            Object.assign(this.guiLeftSpecs.parents, {
                'actions': {
                    start: this.start.bind(this),
                    stop: this.stop.bind(this),
                    moveCamera: this.moveCamera.bind(this),
                    resetCamera: this.resetCamera.bind(this),
                    focusNext: this.focusNext.bind(this)
                }
            });
            this.guiLeftSpecs.details.push({
                folder: 'Actions',
                parent: 'actions',
                specs: [{
                    value: null,
                    type: 'function'
                }]
            });
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
            return;
        }
        const train = new Train('red train');
        this.subscribeEvents(train, worldSceneSpecs.moveType);
        this.loop.updatables.push(train);
        this.scene.add(train.group);
        this.initContainer();
        this.#loaded = true;
    }
}

export { WorldScene2 };