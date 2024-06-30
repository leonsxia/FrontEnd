import { createAxesHelper, createGridHelper } from '../components/helpers.js';
import { createLights } from '../components/lights.js';
import { Earth } from '../components/basic/Earth.js';
import { WorldScene } from './WorldScene.js';

const sceneName = 'Tank';
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
    pointLightColor: [200, 100, 0]
};
const ambientLightCtlSpecs = {
    ambientLightColor: [128, 128, 128]
}
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
        folder: 'Ambient Light',
        parent: 'ambientLight',
        specs: [{
            name: 'intensity',
            value: null,
            params: [0, 20],
            type: 'number'
        }, {
            name: 'ambientLightColor',
            value: ambientLightCtlSpecs,
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

class WorldScene4 extends WorldScene {
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
            color: 0xc86400,
            position: [0, 0, 0],
            intensity: 50,
            distance: 0,    // infinity far
            decay: 1    // default 2
        };
        const ambientLightSpecs = {
            color: 0x808080,
            intensity: 13
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
        this.scene.add(this.#lights.mainLight, this.#lights.hemisphereLight, this.#lights.ambientLight, this.camera, createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

        if (worldSceneSpecs.enableGui) {
            guiRightSpecs.parents.push({ name: 'mainLight', value: this.#lights.mainLight });
            guiRightSpecs.parents.push({ name: 'pointLight', value: this.#lights.pointLight });
            guiRightSpecs.parents.push({ name: 'ambientLight', value: this.#lights.ambientLight });
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

        // earth
        const earthSpecs = {
            surfaceMap: 'assets/textures/earth_surface_2048.jpg',
            normalMap: 'assets/textures/earth_normal_2048.jpg',
            specularMap: 'assets/textures/earth_specular_2048.jpg',
            name: 'earth'
        }
        const earth = new Earth(earthSpecs);
        earth.setPosition([0, 2, 0]);
        earth.setRotation([0.25, 0, 0]);

        await Promise.all([
            earth.init(earthSpecs)
        ]);
        this.loop.updatables.push(earth);
        this.scene.add(earth.mesh);
        this.initContainer();
        this.#loaded = true;
    }
}

export { WorldScene4 };