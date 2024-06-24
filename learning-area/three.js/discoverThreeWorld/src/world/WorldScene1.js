import { createCamera } from './components/camera.js';
import * as Cube from './components/cube.js';
import { Earth } from './components/Earth.js';
import { BoxCube } from './components/BoxCube.js';
import * as Sphere from './components/sphere.js';
import { createLights } from './components/lights.js';
import { createMeshGroup } from './components/meshGroup.js';
import { createScene } from './components/scene.js';

import { WorldControls } from './systems/Controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

// These variables are module-scoped: we cannot access them
// from outside the module
// let camera;
// let renderer;
// let scene;

class WorldScene1 {
    #camera = null;
    #scene = null;
    #renderer = null;
    #loop = null;
    #resizer = null;
    #controls = null;
    #cameraPos = {x: 0, y: 0, z: 20};
    #staticRendering = true;
    #loaded = false;
    #container = null;

    // 1. Create an instance of the World app   
    constructor(container, panels) {
        const cameraSpecs = {
            position: this.#cameraPos
        }
        this.#camera = createCamera(cameraSpecs);
        this.#scene = createScene('#000000');
        this.#renderer = createRenderer();
        this.#loop = new Loop(this.#camera, this.#scene, this.#renderer);
        // container.append(this.#renderer.domElement);
        this.#container = container;

        this.#controls = new WorldControls(this.#camera, this.#renderer.domElement);
        this.#controls.initPanels(panels);

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

        this.#camera.add(pointLight);

        // this.#controls.target.copy(earth.mesh.position);
        // this.#controls.enablePan = false;
        this.#controls.defControl.listenToKeyEvents(window);

        this.#loop.updatables = [this.#controls.defControl];
        this.#scene.add(mainLight, hemisphereLight, this.#camera);

        this.#resizer = new Resizer(container, this.#camera, this.#renderer);
        this.#resizer.onResize = 
        // cube.onTextureLoad = sphere.onTextureLoad = 
        // earth.onTextureLoad = box.onTextureLoad = 
        () => {
            this.render();
        };

        this.#controls.defControl.addEventListener('change', () => this.render());
    }

    async init() {
        this.#container.append(this.#renderer.domElement);
        if (this.#loaded) {
            return
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

        // earth
        const earthSpecs = {
            surfaceMap: 'assets/textures/earth_surface_2048.jpg',
            normalMap: 'assets/textures/earth_normal_2048.jpg',
            specularMap: 'assets/textures/earth_specular_2048.jpg',
            name: 'earth'
        }
        const earth = new Earth(earthSpecs);
        earth.setPosition({x:5, y:0, z:0});
        earth.setRotation({x:0.25, y:0, z:0});

        // mesh group
        const meshGroupSpecs = {
            position: {
                x: 10,
                y: 0,
                z: 0
            }
        };
        const meshGroup = createMeshGroup(meshGroupSpecs);
        const box = new BoxCube(boxSpecs);
        box.setRotation({x:0.25, y:-0.25, z:0});
        box.setPosition({x:0, y:0, z:0});
        await Promise.all([
            Sphere.loadMaterial(sphereSpecs),
            Cube.loadMaterial(cubeSpecs),
            box.init(boxSpecs),
            earth.init(earthSpecs)
        ]);
        this.#loop.updatables.push(sphere, cube, box, earth, meshGroup);
        this.#scene.add(sphere, cube, box.mesh, earth.mesh, meshGroup);
        this.#loaded = true;
    }

    render() {
        this.#renderer.render(this.#scene, this.#camera);
    }

    start() {
        this.#staticRendering = false;
        this.#controls.initPreCoordinates();
        this.#controls.defControl.enableDamping = true;
        this.#controls.defControl.dampingFactor = 0.1; // default 0.05
        this.#loop.start();
    }

    stop() {
        this.#staticRendering = true;
        this.#controls.defControl.enableDamping = false;
        this.#loop.stop();
    }

    update() {
        this.#scene.children.forEach((object) => {
            object.rotation.y += 0.0025;
        })
        this.render();
        window.requestAnimationFrame(this.update.bind(this));
    }

    moveCamera() {
        const moveDist = 5;
        if (this.#staticRendering) {
            this.#controls.moveCameraStatic(moveDist);
        } else {
            this.#controls.moveCamera(moveDist);
        }
    }

    resetCamera() {
        this.#controls.resetCamera();
    }

    focusNext() {}

    reset() {
        this.stop();
        this.#controls.resetCamera();
    }

    dispose() {
        // this.#renderer.dispose();
        // this.#renderer.forceContextLoss();
    }
}

export { WorldScene1 };