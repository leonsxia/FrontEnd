import { Mesh, MeshPhongMaterial, TextureLoader, SRGBColorSpace, MathUtils} from 'three';
import { BasicObject } from './BasicObject';

class Earth extends BasicObject {
    #surfaceMap = null;
    #normalMap = null;
    #specularMap = null;
    #radiansPerSecond = MathUtils.degToRad(8.59);

    constructor(specs) {
        super('sphere', specs);
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.name = specs.name;
    }

    async init(specs) {
        const [surfaceMap, normalMap, specularMap] = await Promise.all([
            new TextureLoader().loadAsync(specs.surfaceMap),
            new TextureLoader().loadAsync(specs.normalMap),
            new TextureLoader().loadAsync(specs.specularMap)
        ]);
        this.#surfaceMap = surfaceMap;
        this.#surfaceMap.colorSpace = SRGBColorSpace;
        this.#normalMap = normalMap;
        this.#specularMap = specularMap;
        this.mesh.material = this.material = new MeshPhongMaterial({ map: this.#surfaceMap, normalMap: this.#normalMap, specularMap: this.#specularMap, specular: 0x111111 });
    }

    tick(delta) {
        this.mesh.rotation.y += delta * this.#radiansPerSecond;
    }
}

export { Earth };