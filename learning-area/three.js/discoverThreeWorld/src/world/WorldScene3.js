import { createAxesHelper, createGridHelper } from './components/helpers.js';
import { createLights } from './components/lights.js';
import { BirdsGroup } from './components/birds/Birds.js'
import { WorldScene } from './WorldScene.js';

const worldSceneSpecs = {
    camera: {
        position: [-1.5, 4.5, 6.5]
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

class WorldScene3 extends WorldScene {
    #loadSequence = 0;
    #objects = [];
    #loaded = false;
    #guiLoaded = false;
    #lights = { mainLight: null, pointLight: null, ambientLight: null, hemisphereLight: null };

    constructor(container, panels, renderer) {
        super(container, panels, renderer, worldSceneSpecs);

        const directLightSpecs = {
            color: '#ffffff',
            intensity: 2,
            position: [-10, 10, 10]
        };
        const pointLightSpecs = {
            color: 0xcccccc,
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
            position: [-10.5, 0, -10.5]
        };
        const gridSpecs = {
            size: 20,
            divisions: 20
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
            return
        }
        const birdsSpecs = {
            models: [{
                src: 'assets/models/Parrot.glb',
                name: 'parrot',
                position: [0, 3, 2.5]
            }, {
                src: 'assets/models/Flamingo.glb',
                name: 'flamingo',
                position: [7.5, 3, -10]
            }, {
                src: 'assets/models/Stork.glb',
                name: 'stork',
                position: [0, 1.5, -10]
            }]
        };

        const birdsGroup = new BirdsGroup(birdsSpecs);
        birdsGroup.name = 'birdsGroup';
        this.#objects.push(birdsGroup);
        await birdsGroup.loadBirds();
        // move the target to the center of the front bird
        this.controls.defControl.target.copy(birdsGroup.getBirds(0).position);
        this.controls.defControl.update();
        this.controls.defControl.saveState();
        this.loop.updatables.push(birdsGroup);
        this.scene.add(birdsGroup);
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

    focusNext() {
        // console.log(this.#loadSequence);
        const birdsGroup = this.#objects.find((obj) => obj.name === 'birdsGroup');
        const allTargets = birdsGroup.positions.concat([{x: 0, y: 0, z: 0}]);
        const allCameraPos = birdsGroup.getBirdsCamsPositions(5);
        allCameraPos.push({x: 20, y: 15, z: 20}); // the last view camera position
        
        if (++this.#loadSequence === allTargets.length) {
            this.#loadSequence = 0;
        }
        if (this.staticRendering) {
            this.controls.defControl.target.copy(allTargets[this.#loadSequence]);
            this.camera.position.copy(allCameraPos[this.#loadSequence]);
            this.controls.defControl.update();
        } else {
            const tar = this.controls.defControl.target;
            const pos = this.camera.position
            if (this.#loadSequence === 0) { // move to first position
                allTargets[allTargets.length - 1] = { x: tar.x, y: tar.y, z: tar.z };
                allCameraPos[allCameraPos.length - 1] = { x: pos.x, y: pos.y, z: pos.z };

                this.controls.focusNext(
                    allTargets[allTargets.length - 1], allTargets[0],
                    allCameraPos[allCameraPos.length - 1], allCameraPos[0]
                );
            } else { // move to next bird
                allTargets[this.#loadSequence - 1] = { x: tar.x, y: tar.y, z: tar.z };
                allCameraPos[this.#loadSequence - 1] = { x: pos.x, y: pos.y, z: pos.z };
                this.controls.focusNext(
                    allTargets[this.#loadSequence - 1], allTargets[this.#loadSequence],
                    allCameraPos[this.#loadSequence - 1], allCameraPos[this.#loadSequence]
                );
            }
        }
        
        this.controls.defControl.update();
    }
}

export { WorldScene3 };