import { Mesh, MeshPhongMaterial } from 'three';
import { BasicObject } from './BasicObject';

class Plane extends BasicObject {
    #map = null;

    constructor(specs) {
        super('plane', specs)
        const { name, color } = specs;
        this.material = new MeshPhongMaterial({ color: color });
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.name = name;
    }

    async init (specs) {
        const [map] = await Promise.all([new TextureLoader().loadAsync(specs.map)]);
        this.#map = map;
        this.#map.colorSpace = SRGBColorSpace;
        this.mesh.material = this.material = new MeshPhongMaterial({ map: this.#map });
    }
}

export { Plane };