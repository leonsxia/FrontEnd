import { Train } from './components/Train/Train.js';
import { createAxesHelper, createGridHelper } from './components/helpers.js';
import { createLights } from './components/lights.js';
import { WorldScene } from './WorldScene.js';

const worldSceneSpecs = {
    camera: {
        position: [10, 10, 10]
    },
    scene: {
        backgroundColor: 'lightblue'
    }
};
const mainLightCtlSpecs = {
    mainLightColor: [255, 255, 255]
};
const pointLightCtlSpecs = {
    pointLightColor: [255, 255, 255]
};
const hemisphereLightCtlSpecs = {
    hemisphereLightGroundColor: [47, 79, 79],
    hemisphereLightSkyColor: [160, 160, 160]
}

class WorldScene2 extends WorldScene {
    #loaded = false;
    #guiLoaded = false;
    #lights = { mainLight: null, pointLight: null, ambientLight: null, hemisphereLight: null };

    constructor(container, panels, renderer) {
        super(container, panels, renderer, worldSceneSpecs);

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
            position: [-5.5, 0, -5.5]
        };
        const gridSpecs = {
            size: 10,
            divisions: 10
        }
        this.loop.updatables = [this.controls.defControl];
        this.scene.add(this.#lights.mainLight, this.#lights.hemisphereLight, this.camera, createAxesHelper(axesSpecs), createGridHelper(gridSpecs));

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
        const train = new Train();
        this.loop.updatables.push(train);
        this.scene.add(train);
        this.initContainer();
        this.#loaded = true;
    }

    initGUIControl() {
        if (this.#guiLoaded) return;
        this.#guiLoaded = true;
        const folder1 = this.gui.addFolder('Directional Light');
        folder1.addColor(mainLightCtlSpecs, 'mainLightColor', 255);
        folder1.add(this.#lights.mainLight, 'intensity', 0, 20);
        const folder2 = this.gui.addFolder('Point Light');
        folder2.addColor(pointLightCtlSpecs, 'pointLightColor', 255);
        folder2.add(this.#lights.pointLight, 'intensity', 0, 50);
        const folder3 = this.gui.addFolder('Hemisphere Light');
        folder3.addColor(hemisphereLightCtlSpecs, 'hemisphereLightSkyColor', 255);
        folder3.addColor(hemisphereLightCtlSpecs, 'hemisphereLightGroundColor', 255);
        folder3.add(this.#lights.hemisphereLight, 'intensity', 0, 50);
        this.gui.onChange((event) => {
            const val = event.value;
            const color = `rgb(${val[0]},${val[1]},${val[2]})`;
            switch (event.property) {
                case 'mainLightColor':
                    this.#lights.mainLight.color.setStyle(color);
                    break;
                case 'pointLightColor':
                    this.#lights.pointLight.color.setStyle(color);
                    break;
                case 'hemisphereLightSkyColor':
                    this.#lights.hemisphereLight.color.setStyle(color);
                    break;
                case 'hemisphereLightGroundColor':
                    this.#lights.hemisphereLight.groundColor.setStyle(color);
                    break;
            }
            if (this.staticRendering) this.render();
        });
    }
}

export { WorldScene2 };