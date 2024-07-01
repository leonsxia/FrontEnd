import * as Cube from '../components/basic/cube.js';
import { Earth } from '../components/basic/Earth.js';
import { BoxCube } from '../components/basic/BoxCube.js';
import * as Sphere from '../components/basic/sphere.js';
import { createBasicLights, createPointLights } from '../components/lights.js';
import { createMeshGroup } from '../components/basic/meshGroup.js';
import { setupShadowLight } from '../components/shadowMaker.js';
import { makeFunctionGuiConfig, makeSceneRightGuiConfig } from '../components/utils/guiConfigHelper.js';
import { WorldScene } from './WorldScene.js';

const sceneName = 'scene1';
const worldSceneSpecs = {
    name: sceneName,
    camera: {
        position: [0, 0, 20]
    },
    scene: {
        backgroundColor: '#000000'
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
        intensity: 8,
        position: [-10, 10, 10]
    },
    debug: true,
    shadow: false,
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
        intensity: 15,
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
            color: [255, 255, 0],
            position: [0, 0, 0],
            intensity: 50,
            distance: 0,    // infinity far
            decay: 1    // default 2
        },
        debug: true,
        shadow: false,
        visible: true
    }
];

class WorldScene1 extends WorldScene  {
    #loaded = false;
    #basicLights = { mainLight: null, ambientLight: null, hemisphereLight: null };
    #pointLights = {};

    // 1. Create an instance of the World app   
    constructor(container, renderer, globalConfig, eventDispatcher) {
        Object.assign(worldSceneSpecs, globalConfig)
        super(container, renderer, worldSceneSpecs, eventDispatcher);

        this.#basicLights = createBasicLights(mainLightCtlSpecs, ambientLightCtlSpecs, hemisphereLightCtlSpecs);
        this.#pointLights = createPointLights(pointLightSpecsArr);

        this.camera.add(this.#pointLights['cameraPointLight']);
        
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(this.#basicLights.hemisphereLight, this.camera);

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
        if (this.#loaded) {
            this.initContainer();
            return;
        }
        // sphere
        const sphereSpecs = {
            map: 'assets/textures/crate.gif',
            name: 'sphere',
            size: {
                radius: 2,
                widthSegments: 32,
                heightSegments: 32
            }
        }
        const sphere = Sphere.createSphere(sphereSpecs);
        sphere.position.set(-10, 0, 0);
        sphere.rotation.set(0.25, 0, 0);

        // cube
        const cubeSpecs = {
            map: 'assets/textures/uv-test-col.png',
            name: 'box',
            size: {
                width: 2,
                height: 2,
                depth: 2
            },
            basicMaterial: worldSceneSpecs.basicMaterial
        }
        const cube = Cube.createCube(cubeSpecs);
        cube.position.set(-5, 0, 0);

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
        box.setPosition([0, 0, 0]);

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
        earth.setPosition([5, 0, 0]);
        earth.setRotation([0.25, 0, 0]);

        // mesh group
        const meshGroupSpecs = {
            position: [10, 0, 0]
        };
        const meshGroup = createMeshGroup(meshGroupSpecs);
        
        await Promise.all([
            Sphere.loadMaterial(sphereSpecs),
            Cube.loadMaterial(cubeSpecs),
            box.init(boxSpecs),
            earth.init(earthSpecs)
        ]);
        this.loop.updatables.push(sphere, cube, box, earth, meshGroup);
        this.scene.add(sphere, cube, box.mesh, earth.mesh, meshGroup);
        this.initContainer();
        this.#loaded = true;
    }
}

export { WorldScene1 };