import { WorldScene1 } from "./WorldScene1";
import { WorldScene2 } from "./WorldScene2";
import { WorldScene3 } from "./WorldScene3";
import { createRenderer } from "./systems/renderer";

class World {
    #renderer;

    constructor(container, panels) {
        this.#renderer = createRenderer();
        this.#renderer.name = 'world_renderer';
        this.worldScenes = [];
        this.worldScenes.push(new WorldScene1(container, panels, this.#renderer));
        this.worldScenes.push(new WorldScene2(container, panels, this.#renderer));
        this.worldScenes.push(new WorldScene3(container, panels, this.#renderer));
    }
}

export { World };