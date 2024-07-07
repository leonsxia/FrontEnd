import { createAxesHelper, createGridHelper } from '../components/utils/helpers.js';
import { createBasicLights, createPointLights, createSpotLights } from '../components/lights.js';
import { Train, Tofu, Sphere, BoxCube, Plane } from '../components/Models.js';
import { setupShadowLight } from '../components/shadowMaker.js';
import { SimplePhysics } from '../components/SimplePhysics.js';
import { WorldScene } from './WorldScene.js';
import { Vector3 } from 'three';

const sceneName = 'Simple Physics';
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
        intensity: 0.7,
        position: [-10, 20, 8.5],
        target: [0, 0, 0]
    },
    type: 'directional',
    debug: true,
    shadow: true,
    shadow_debug: true,
    helper_show: false,
    shadow_cam_show: false,
    visible: true
};
const ambientLightCtlSpecs = {
    name: 'ambientLight',
    display: 'Ambient Light',
    detail: {
        color: [128, 128, 128],
        intensity: 1
    },
    type: 'ambient',
    debug: true,
    visible: true
}
const hemisphereLightCtlSpecs = {
    name: 'hemisphereLight',
    display: 'Hemisphere Light',
    detail: {
        groundColor: [47, 79, 79],
        skyColor: [160, 160, 160],
        intensity: 0.5,
        position: [0, 1, 0] // light emit from top to bottom
    },
    type: 'hemisphere',
    debug: true,
    helper_show: false,
    visible: true
};
const basicLightSpecsArr = [mainLightCtlSpecs, ambientLightCtlSpecs, hemisphereLightCtlSpecs];
const pointLightSpecsArr = [
    {
        name: 'pointLight1',
        display: 'Point Light 1',
        detail: {
            color: [254, 190, 16],
            position: [7.8, 10, 0],
            intensity: 50,
            distance: 0,    // infinite far
            decay: 1    // default 2
        },
        debug: true,
        shadow: true,
        shadow_debug: true,
        helper_show: false,
        shadow_cam_show: false,
        visible: true
    }
];
const spotLightSpecsArr = [
    {
        name: 'spotLight1',
        display: 'Spot Light 1',
        detail: {
            color: [255, 235, 0],
            position: [5, 12, - 21],
            target: [0.4, - .2, 11.8],
            intensity: 26,
            distance: 45,    // 0 infinite far
            decay: 0.33,
            penumbra: 0.35
        },
        debug: true,
        shadow: true,
        shadow_debug: true,
        helper_show: false,
        shadow_cam_show: false,
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
    #basicLights = {};
    #pointLights = {};
    #spotLights = {};

    constructor(container, renderer, globalConfig, eventDispatcher) {
        Object.assign(worldSceneSpecs, globalConfig)
        super(container, renderer, worldSceneSpecs, eventDispatcher);

        this.#basicLights = createBasicLights(basicLightSpecsArr);
        this.#pointLights = createPointLights(pointLightSpecsArr);
        this.#spotLights = createSpotLights(spotLightSpecsArr);
        Object.assign(this.lights, this.#basicLights);
        Object.assign(this.lights, this.#pointLights);
        Object.assign(this.lights, this.#spotLights);

        // this.camera.add(this.#pointLights['cameraSpotLight']);

        this.loop.updatables = [this.controls.defControl];
        this.scene.add( //this.camera, 
            createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

        // shadow light setup, including light helper
        this.renderer.shadowMap.enabled = worldSceneSpecs.enableShadow;
        this.shadowLightObjects = setupShadowLight.call(this,
            this.scene, ...basicLightSpecsArr, ...pointLightSpecsArr, ...spotLightSpecsArr
        );

        // Gui setup
        if (worldSceneSpecs.enableGui) {
            this.guiLights = { basicLightSpecsArr, pointLightSpecsArr, spotLightSpecsArr };
            this.setupGuiConfig();
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
        ground.updateBoundingBoxHelper();
        ground.receiveShadow(true);

        // ceiling
        const ceilingSpecs = {
            width: 100,
            height: 100,
            color: 0xcccccc,
            name: 'ceiling'
        };
        const ceiling = new Plane(ceilingSpecs);
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
            }
        }
        const earth = new Sphere(earthSpecs);
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
        box.setScale([3, 3, 3]);
        box.castShadow(true);
        box.receiveShadow(true);

        const train = new Train('red train 2');
        this.subscribeEvents(train, worldSceneSpecs.moveType);
        train.castShadow(true);
        train.receiveShadow(true);
        train.setPosition([0, 0, 0]);
        train.updateBoundingBoxHelper();

        const tofu = new Tofu('tofu1');
        this.subscribeEvents(tofu, worldSceneSpecs.moveType);
        tofu.castShadow(true);
        tofu.receiveShadow(true);
        tofu.setPosition([0, 0, 3]);
        tofu.setRotation([0, Math.PI, 0]);
        tofu.setScale([.5, .5, .5]);
        tofu.updateBoundingBoxHelper();

        await Promise.all([
            earth.init(earthSpecs),
            box.init(boxSpecs)
        ]);

        const walls = this.createWalls().concat(this.createWalls2());
        this.players.push(tofu);
        // this.players.push(train);
        this.player = tofu;
        // this.player = train;
        this.walls = walls;
        this.floors.push(ground);
        this.physics = new SimplePhysics(this.players, this.floors, this.walls, this.obstacles);
        this.physics.addActivePlayers('tofu1');
        // this.physics.addActivePlayers('red train 2');

        this.loop.updatables.push(earth, box, this.physics);
        this.scene.add(ground.mesh, ground.boundingBoxHelper, ceiling.mesh, 
            tofu.group, tofu.boundingBoxHelper
            // train.group, train.boundingBoxHelper
        );
        walls.forEach(w => {
            this.scene.add(w.mesh, w.line);
        });

        this.initContainer();
        this.#loaded = true;

        // console.log(tofu.boundingBox.getCenter(new Vector3()));
        // console.log(tofu.boundingBox.getSize(new Vector3()));
    }

    setupLeftFunctionPanle() {
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
    }

    createWalls() {
        // wall
        const wallSpecs = {
            width: 10,
            height: 5,
            color: 0xcccccc,
            name: 'wall'
        };
        const wall = new Plane(wallSpecs);
        wall.receiveShadow(true);
        // wall.setDoubleSide();
        // wall.setDoubleShadowSide();
        wall.castShadow(true);
        wall.setPosition([20, 0, 0]);
        wall.setRotationY(- Math.PI / 6);
        wall.updateBoundingBoxHelper();

        const wall2Specs = {
            width: 10,
            height: 5,
            color: 0xcccccc,
            name: 'wall2'
        };
        const wall2 = new Plane(wall2Specs);
        wall2.receiveShadow(true);
        // wall2.setDoubleSide();
        // wall2.setDoubleShadowSide();
        wall2.castShadow(true);
        wall2.setPosition([13.2, 0, 1.8]);
        wall2.setRotationY(Math.PI / 3);
        wall2.updateBoundingBoxHelper();

        const wall3Specs = {
            width: 10,
            height: 5,
            color: 0xcccccc,
            name: 'wall3'
        };
        const wall3 = new Plane(wall3Specs);
        wall3.receiveShadow(true);
        // wall3.setDoubleSide();
        // wall3.setDoubleShadowSide();
        wall3.castShadow(true);
        wall3.setPosition([15, 0, 8.6]);
        wall3.setRotationY(5 * Math.PI / 6);
        wall3.updateBoundingBoxHelper();

        const wall4Specs = {
            width: 10,
            height: 5,
            color: 0xcccccc,
            name: 'wall4'
        };
        const wall4 = new Plane(wall4Specs);
        wall4.receiveShadow(true);
        // wall4.setDoubleSide();
        // wall4.setDoubleShadowSide();
        wall4.castShadow(true);
        wall4.setPosition([21.8, 0, 6.8]);
        wall4.setRotationY(- 2 * Math.PI / 3);
        wall4.updateBoundingBoxHelper();

        return [wall, wall2, wall3, wall4];
    }

    createWalls2() {
        // wall
        const wallSpecs = {
            width: 10,
            height: 5,
            color: 0xcccccc,
            name: 'wall5'
        };
        const wall = new Plane(wallSpecs);
        wall.receiveShadow(true);
        // wall.setDoubleSide();
        // wall.setDoubleShadowSide();
        wall.castShadow(true);
        wall.setPosition([0, 0, - 5]);
        wall.setRotationY(0);
        wall.updateBoundingBoxHelper();

        const wall2Specs = {
            width: 10,
            height: 5,
            color: 0xcccccc,
            name: 'wall6'
        };
        const wall2 = new Plane(wall2Specs);
        wall2.receiveShadow(true);
        // wall2.setDoubleSide();
        // wall2.setDoubleShadowSide();
        wall2.castShadow(true);
        wall2.setPosition([- 5, 0, 0]);
        wall2.setRotationY(Math.PI / 2);
        wall2.updateBoundingBoxHelper();

        const wall3Specs = {
            width: 10,
            height: 5,
            color: 0xcccccc,
            name: 'wall7'
        };
        const wall3 = new Plane(wall3Specs);
        wall3.receiveShadow(true);
        // wall3.setDoubleSide();
        // wall3.setDoubleShadowSide();
        wall3.castShadow(true);
        wall3.setPosition([0, 0, 5]);
        wall3.setRotationY(Math.PI);
        wall3.updateBoundingBoxHelper();

        const wall4Specs = {
            width: 10,
            height: 5,
            color: 0xcccccc,
            name: 'wall8'
        };
        const wall4 = new Plane(wall4Specs);
        wall4.receiveShadow(true);
        // wall4.setDoubleSide();
        // wall4.setDoubleShadowSide();
        wall4.castShadow(true);
        wall4.setPosition([5, 0, 0]);
        wall4.setRotationY(- Math.PI / 2);
        wall4.updateBoundingBoxHelper();

        return [wall, wall2, wall3, wall4];
    }

    focusNext() {
        const allTargets = [
            { x: 0, y: 0, z: 0 },
            { x: 18, y: 0, z: 4 },
        ];
        const allCameraPos = [
            { x: 10, y: 10, z: 10 },
            { x: 20, y: 10, z: 20 }
        ];
        const allPlayerPos = [
            [0, 0, 0],
            [18, 0, 4],
        ]

        const setup = { allTargets, allCameraPos, allPlayerPos };

        this.focusNextProcess(setup);
    }
}

export { WorldScene4 };