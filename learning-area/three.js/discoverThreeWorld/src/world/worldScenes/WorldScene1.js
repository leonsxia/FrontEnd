import * as Cube from '../components/cube.js';
import { Earth } from '../components/Earth.js';
import { BoxCube } from '../components/BoxCube.js';
import * as Sphere from '../components/sphere.js';
import { createLights } from '../components/lights.js';
import { createMeshGroup } from '../components/meshGroup.js';
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

class WorldScene1 extends WorldScene  {
    #loaded = false;
    #lights = { mainLight: null, pointLight: null, ambientLight: null, hemisphereLight: null };

    // 1. Create an instance of the World app   
    constructor(container, renderer, globalConfig, eventDispatcher) {
        Object.assign(worldSceneSpecs, globalConfig)
        super(container, renderer, worldSceneSpecs, eventDispatcher);
        
        const directLightSpecs = {
            color: 'white',
            intensity: 8,
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
            intensity: 15,
            position: [0, 1, 0] // light emit from top to bottom
        };
        this.#lights = createLights(directLightSpecs, pointLightSpecs, ambientLightSpecs, hemisphereLightSpecs);

        this.camera.add(this.#lights.pointLight);
        
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(this.#lights.mainLight, this.#lights.hemisphereLight, this.camera);

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
            }
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
            }
        }
        const box = new BoxCube(boxSpecs);
        box.setRotation([0.25, -0.25, 0]);
        box.setPosition([0, 0, 0]);

        // earth
        const earthSpecs = {
            surfaceMap: 'assets/textures/earth_surface_2048.jpg',
            normalMap: 'assets/textures/earth_normal_2048.jpg',
            specularMap: 'assets/textures/earth_specular_2048.jpg',
            name: 'earth'
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