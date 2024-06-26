import * as Cube from './components/cube.js';
import { Earth } from './components/Earth.js';
import { BoxCube } from './components/BoxCube.js';
import * as Sphere from './components/sphere.js';
import { createLights } from './components/lights.js';
import { createMeshGroup } from './components/meshGroup.js';
import { WorldScene } from './WorldScene.js';

const worldSceneSpecs = {
    camera: {
        position: [0, 0, 20]
    },
    scene: {
        backgroundColor: '#000000'
    }
}

class WorldScene1 extends WorldScene  {
    #loaded = false;

    // 1. Create an instance of the World app   
    constructor(container, panels, renderer) {
        super(container, panels, renderer, worldSceneSpecs);
        
        const directLightSpecs = {
            color: 'white',
            intensity: 8,
            position: [-10, 10, 10]
        };
        const spotLightSpecs = {
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
        const { mainLight, pointLight, ambientLight, hemisphereLight } = createLights(directLightSpecs, spotLightSpecs, ambientLightSpecs, hemisphereLightSpecs);

        this.camera.add(pointLight);
        
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(mainLight, hemisphereLight, this.camera);

        return {
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