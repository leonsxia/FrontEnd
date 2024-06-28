import { WorldScene1 } from "./worldScenes/WorldScene1";
import { WorldScene2 } from "./worldScenes/WorldScene2";
import { WorldScene3 } from "./worldScenes/WorldScene3";
import { createRenderer } from "./systems/renderer";

const config = { 
    scenes: ['scene1', 'scene2', 'scene3']
};
class World {
    #renderer;
    #currentScene;
    #infosDomElements;
    #container;

    constructor(container, infos) {
        this.#renderer = createRenderer();
        this.#renderer.name = 'world_renderer';
        this.#container = container;
        this.#infosDomElements = infos;
        this.worldScenes = [];
        config.changeCallback = this.changeScene.bind(this);
        this.worldScenes.push(new WorldScene1(container, this.#renderer, config));
        this.worldScenes.push(new WorldScene2(container, this.#renderer, config));
        this.worldScenes.push(new WorldScene3(container, this.#renderer, config));
    }

    async changeScene(name) {
        if (this.#currentScene) this.#currentScene.reset(); // reset camera, gui, controls, stop animation
        this.#container.innerHTML = '';
        if (this.#infosDomElements) {
            this.#infosDomElements.header.textContent = `DiscoverThreeJs - World ${name}`;
            this.#infosDomElements.msg.textContent = 'loading assets...';
        }

        const loadScene = this.worldScenes.find(s => s.name === name);
        await loadScene.init();

        this.#currentScene = loadScene;
        console.log(`Scene: ${this.#currentScene.name} Renderer: ${this.#currentScene.renderer.name}`);
        if (this.#infosDomElements) {
            this.#infosDomElements.msg.textContent = 'assets all loaded.'
        }
        loadScene.render();
    }
}

export { World };