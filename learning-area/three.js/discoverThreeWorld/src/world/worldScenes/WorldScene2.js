import { Train } from '../components/train/Train.js';
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
    mainLightColor: [255, 255, 255]
};
const pointLightCtlSpecs = {
    pointLightColor: [255, 255, 0]
};
const hemisphereLightCtlSpecs = {
    hemisphereLightGroundColor: [47, 79, 79],
    hemisphereLightSkyColor: [160, 160, 160]
};

const guiRightSpecs = {
    parents: [],
    details: [{
        folder: 'Directional Light',
        parent: 'mainLight',
        specs: [{
            name: 'intensity',
            value: null,
            params: [0, 20],
            type: 'number'
        }, {
            name: 'mainLightColor',
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
            name: 'pointLightColor',
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
            name: 'hemisphereLightSkyColor',
            value: hemisphereLightCtlSpecs,
            params: [255],
            type: 'color'
        }, {
            name: 'hemisphereLightGroundColor',
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

        const directLightSpecs = {
            color: 'white',
            intensity: 2,
            position: [-10, 10, 10]
        };
        const pointLightSpecs = {
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
        this.#lights = createLights(directLightSpecs, pointLightSpecs, ambientLightSpecs, hemisphereLightSpecs);

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
            guiRightSpecs.parents.push({ name: 'mainLight', value: this.#lights.mainLight });
            guiRightSpecs.parents.push({ name: 'pointLight', value: this.#lights.pointLight });
            guiRightSpecs.parents.push({ name: 'hemisphereLight', value: this.#lights.hemisphereLight });
            this.guiRightSpecs = guiRightSpecs;
            this.guiLeftSpecs.parents.push({
                name: 'actions',
                value: {
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
        this.subscribeEvents(train);
        this.loop.updatables.push(train);
        this.scene.add(train.group);
        this.initContainer();
        this.#loaded = true;
    }

    subscribeEvents(obj) {
        this.eventDispatcher.actions.forEach(action => {
            const callback = obj[action];
            if (callback) {
                const subscriber = {
                    subscriber: obj,
                    scene: this.name,
                    callback: callback
                }
                this.eventDispatcher.subscribe(worldSceneSpecs.moveType, action, subscriber);
            }
        });
    }
}

export { WorldScene2 };