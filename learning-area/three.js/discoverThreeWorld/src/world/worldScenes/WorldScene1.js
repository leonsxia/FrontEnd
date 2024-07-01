import * as Cube from '../components/basic/cube.js';
import { Earth } from '../components/basic/Earth.js';
import { BoxCube } from '../components/basic/BoxCube.js';
import * as Sphere from '../components/basic/sphere.js';
import { createLights } from '../components/lights.js';
import { createMeshGroup } from '../components/basic/meshGroup.js';
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
    enableGui: true
};
const mainLightCtlSpecs = {
    color: [255, 255, 255],
    intensity: 8,
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
    intensity: 15,
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

class WorldScene1 extends WorldScene  {
    #loaded = false;
    #lights = { mainLight: null, pointLight: null, ambientLight: null, hemisphereLight: null };

    // 1. Create an instance of the World app   
    constructor(container, renderer, globalConfig, eventDispatcher) {
        Object.assign(worldSceneSpecs, globalConfig)
        super(container, renderer, worldSceneSpecs, eventDispatcher);

        this.#lights = createLights(mainLightCtlSpecs, pointLightCtlSpecs, ambientLightCtlSpecs, hemisphereLightCtlSpecs);

        this.camera.add(this.#lights.pointLight);
        
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(this.#lights.mainLight, this.#lights.hemisphereLight, this.camera);

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