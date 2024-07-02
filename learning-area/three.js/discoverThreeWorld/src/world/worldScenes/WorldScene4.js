import { createAxesHelper, createGridHelper } from '../components/utils/helpers.js';
import { createBasicLights, createPointLights } from '../components/lights.js';
import { Earth } from '../components/basic/Earth.js';
import { Plane } from '../components/basic/Plane.js';
import { BoxCube } from '../components/basic/BoxCube.js';
import { Train } from '../components/composite/train/Train.js';
import { setupShadowLight } from '../components/shadowMaker.js';
import { makeFunctionGuiConfig, makeSceneRightGuiConfig } from '../components/utils/guiConfigHelper.js';
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
    moveType: 'tankmove',
    enableShadow: true
};
// basic lights
const mainLightCtlSpecs = {
    name: 'mainLight',
    display: 'Directional Light',
    detail: {
        color: [255, 255, 255],
        intensity: 3,
        position: [-10, 20, 8.5]
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
        intensity: 1
    },
    debug: true,
    visible: true
}
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
        name: 'pointLight1',
        display: 'Point Light 1',
        detail: {
            color: [223, 216, 17],
            position: [-5, 10, 0],
            intensity: 50,
            distance: 0,    // infinity far
            decay: 1    // default 2
        },
        debug: true,
        shadow: true,
        visible: true
    }
];
const spotLightSpecsArr = [
    {
        name: 'spotLight1',
        detail: {},
        debug: true,
        shadow: true,
        visible: true
    }
];
// axes, grid helper
const axesSpecs = {
    size: 3,
    position: [-50.5, 0, -50.5]
};
const gridSpecs = {
    size: 100,
    divisions: 100
}

class WorldScene4 extends WorldScene {
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
        this.scene.add(this.#basicLights.hemisphereLight, this.#basicLights.ambientLight, //this.camera, 
            createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

        // shadow light setup, including light helper
        this.renderer.shadowMap.enabled = worldSceneSpecs.enableShadow;
        this.shadowLightObjects = setupShadowLight.call(this,
            this.scene, mainLightCtlSpecs, hemisphereLightCtlSpecs, ...pointLightSpecsArr
        );

        // Gui setup
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
            // this.updateMainLightCamera();
            return;
        }
        
        // groud
        const groudSpecs = {
            width: 100,
            height: 100,
            color: 0xCC8866,
            name: 'ground'
        };
        const ground = new Plane(groudSpecs);
        ground.setRotation([-.5 * Math.PI, 0, 0]);
        ground.receiveShadow(true);

        // ceiling
        const ceilingSpecs = {
            width: 100,
            height: 100,
            color: 0xcccccc,
            name: 'ceiling'
        };
        const ceiling = new Plane(groudSpecs);
        ceiling.setRotation([.5 * Math.PI, 0, 0]);
        ceiling.setPosition([0, 20, 0]);
        ceiling.receiveShadow(true);

        // earth
        const earthSpecs = {
            surfaceMap: 'assets/textures/earth_surface_2048.jpg',
            normalMap: 'assets/textures/earth_normal_2048.jpg',
            specularMap: 'assets/textures/earth_specular_2048.jpg',
            name: 'earth',
            size: {
                radius: 2,
                widthSegments: 32,
                heightSegments: 32
            },
            basicMaterial: worldSceneSpecs.basicMaterial
        }
        const earth = new Earth(earthSpecs);
        earth.setPosition([0, 10, 0]);
        earth.setRotation([0.25, 0, 0]);
        earth.castShadow(true);
        earth.receiveShadow(true);

        // box cube
        const boxSpecs = {
            map: 'assets/textures/crate.gif',
            name: 'crate',
            size: {
                width: 2,
                height: 3,
                depth: 3
            },
            basicMaterial: worldSceneSpecs.basicMaterial
        }
        const box = new BoxCube(boxSpecs);
        box.setRotation([0.25, -0.25, 0]);
        box.setPosition([-10, 10, 0]);
        box.castShadow(true);
        box.receiveShadow(true);

        const train = new Train('red train 2');
        this.subscribeEvents(train, worldSceneSpecs.moveType);
        train.castShadow(true);
        train.receiveShadow(true);

        await Promise.all([
            earth.init(earthSpecs),
            box.init(boxSpecs)
        ]);
        this.loop.updatables.push(earth, train, box);
        this.scene.add(ground.mesh, ceiling.mesh, earth.mesh, box.mesh, train.group);
        this.initContainer();
        this.#loaded = true;
    }
}

export { WorldScene4 };