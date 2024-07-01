import { createAxesHelper, createCameraHelper, createDirectialLightHelper, createGridHelper } from '../components/helpers.js';
import { createLights } from '../components/lights.js';
import { Earth } from '../components/basic/Earth.js';
import { Plane } from '../components/basic/Plane.js';
import { BoxCube } from '../components/basic/BoxCube.js';
import { Train } from '../components/composite/train/Train.js';
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
    color: [255, 255, 255],
    intensity: 3,
    position: [-10, 20, 8.5]
};
const pointLightCtlSpecs = {
    color: [200, 100, 0],
    position: [0, 0, 0],
    intensity: 50,
    distance: 0,    // infinity far
    decay: 1    // default 2
};
const ambientLightCtlSpecs = {
    color: [128, 128, 128],
    intensity: 1
}
const hemisphereLightCtlSpecs = {
    groundColor: [47, 79, 79],
    skyColor: [160, 160, 160],
    intensity: 3,
    position: [0, 1, 0] // light emit from top to bottom
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
            name: 'color',
            value: mainLightCtlSpecs,
            params: [255],
            type: 'color'
        }, {
            name: 'x',
            prop: 'position.x',
            value: null,
            sub: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'y',
            prop: 'position.y',
            value: null,
            sub: 'position',
            params: [0, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'z',
            prop: 'position.z',
            value: null,
            sub: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'x',
            prop: 'target.x',
            value: null,
            sub: 'target',
            subprop: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'y',
            prop: 'target.y',
            value: null,
            sub: 'target',
            subprop: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'z',
            prop: 'target.z',
            value: null,
            sub: 'target',
            subprop: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'width',
            prop: 'shadow cam width',
            value: null,
            sub: 'shadow',
            subprop: 'camera',
            params: [1, 100],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'height',
            prop: 'shadow cam height',
            value: null,
            sub: 'shadow',
            subprop: 'camera',
            params: [1, 100],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'near',
            prop: 'shadow cam near',
            value: null,
            sub: 'shadow',
            subprop: 'camera',
            params: [0.1, 10, 0.1],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'far',
            prop: 'shadow cam far',
            value: null,
            sub: 'shadow',
            subprop: 'camera',
            params: [10, 100, 0.1],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'zoom',
            prop: 'shadow cam zoom',
            value: null,
            sub: 'shadow',
            subprop: 'camera',
            params: [0.01, 1.5, 0.01],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'visible',
            prop: 'light helper',
            value: null,
            sub: 'lightHelper',
            type: 'boolean'
        }, {
            name: 'visible',
            prop: 'shadow camera',
            value: null,
            sub: 'lightShadowCamHelper',
            type: 'boolean'
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
            name: 'color',
            value: ambientLightCtlSpecs,
            params: [255],
            type: 'color',
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

class WorldScene4 extends WorldScene {
    #loaded = false;
    #lights = { mainLight: null, pointLight: null, ambientLight: null, hemisphereLight: null };
    #mainLightHelper;
    #mainShadowCamHelper;

    constructor(container, renderer, globalConfig, eventDispatcher) {
        Object.assign(worldSceneSpecs, globalConfig)
        super(container, renderer, worldSceneSpecs, eventDispatcher);
        this.renderer.shadowMap.enabled = true;

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
        this.#mainShadowCamHelper = createCameraHelper(this.#lights.mainLight.shadow.camera);
        this.#mainLightHelper = createDirectialLightHelper(this.#lights.mainLight);
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(this.#lights.mainLight, this.#lights.hemisphereLight, this.#lights.ambientLight, this.camera, 
            createAxesHelper(axesSpecs), createGridHelper(gridSpecs), 
            this.#mainShadowCamHelper, 
            this.#mainLightHelper);

        if (worldSceneSpecs.enableGui) {
            this.attachLightHelper(this.#lights.mainLight);
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
            // Object.assign(this.guiRightSpecs)
            this.guiRightSpecs.details.forEach(detail => {
                detail.specs.forEach(spec => {
                    if (spec.hasOwnProperty('changeFn') && spec.type === 'light-num') {
                        spec['changeFn'] = this.updateMainLightCamera.bind(this);
                    }
                })
            });
        }

        this.setShadowCamProps(this.#lights.mainLight.shadow.camera);
        this.addShadow(this.#lights.mainLight);
        // fix when change light position or target, the shadow camera won't update at first frame.
        this.updateMainLightCamera();
        
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
        this.renderer.shadowMap.enabled = true;
        if (this.#loaded) {
            this.initContainer();
            // this.updateMainLightCamera();
            return;
        }
        
        // groud
        const groudSpecs = {
            width: 50,
            height: 50,
            color: 0xCC8866,
            name: 'ground'
        };
        const ground = new Plane(groudSpecs);
        ground.setRotation([-.5 * Math.PI, 0, 0]);
        ground.receiveShadow(true);

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

        const train = new Train('red train 2');
        this.subscribeEvents(train, worldSceneSpecs.moveType);
        train.castShadow(true);
        train.receiveShadow(true);

        await Promise.all([
            earth.init(earthSpecs),
            box.init(boxSpecs)
        ]);
        this.loop.updatables.push(earth, train, box);
        this.scene.add(ground.mesh, earth.mesh, box.mesh, train.group);
        this.initContainer();
        this.#loaded = true;
    }

    addShadow(light) {
        light.castShadow = true;
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;

		const w = 76;
        const h = 76;
        light.shadow.camera.width = w;
        light.shadow.camera.height = h;
		light.shadow.camera.near = 1;
		light.shadow.camera.far = 70;
		light.shadow.bias = 0.001;
    }

    setShadowCamProps(camera) {
        Object.defineProperty(camera, 'width', {
            get() {
                return this.right * 2;
            },
            set(value) {
                this.left = value / - 2;
                this.right = value / 2;
            }
        });
        Object.defineProperty(camera, 'height', {
            get() {
                return this.top * 2;
            },
            set(value) {
                this.bottom = value / - 2;
                this.top = value / 2;
            }
        });
    }

    attachLightHelper(light) {
        light['lightHelper'] = this.#mainLightHelper;
        light['lightShadowCamHelper'] = this.#mainShadowCamHelper;
    }

    updateMainLightCamera() {
        const { mainLight } = this.#lights;
        // update the light target's matrixWorld because it's needed by the helper
        mainLight.target.updateMatrixWorld();
        this.#mainLightHelper.update();
        // update the light's shadow camera's projection matrix
        mainLight.shadow.camera.updateProjectionMatrix();
        // and now update the camera helper we're using to show the light's shadow camera
        this.#mainShadowCamHelper.update();
        this.render();
    }
}

export { WorldScene4 };