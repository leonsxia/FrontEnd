import { SphereGeometry, Mesh, MeshPhongMaterial, MeshBasicMaterial, TextureLoader, SRGBColorSpace} from 'three';

class Earth {
    #surfaceMap = null;
    #normalMap = null;
    #specularMap = null;
    #material = null;
    #sphereGeometry = null;
    #mesh = null;

    constructor(specs) {
        this.init(specs);
    }

    init(specs) {
        if (specs.surfaceMap) {
            this.#surfaceMap = new TextureLoader().load(specs.surfaceMap);
            this.#surfaceMap.colorSpace = SRGBColorSpace;
        } else {
            console.log('must provide a surface texture.');
            return this;
        }

        if (specs.normalMap) {
            this.#normalMap = new TextureLoader().load(specs.normalMap);
        }

        if (specs.specularMap) {
            this.#specularMap = new TextureLoader().load(specs.specularMap);
        }

        this.#material = new MeshPhongMaterial({ map: this.#surfaceMap, normalMap: this.#normalMap, specularMap: this.#specularMap, specular: 0x111111 });
        // this.#material = new MeshStandardMaterial({color: '#ff0000'});

        this.#sphereGeometry = new SphereGeometry(2, 32, 32);

        this.#mesh = new Mesh(this.#sphereGeometry, this.#material);
    }

    setPosition(pos) {
        this.#mesh.position.set(pos.x, pos.y, pos.z);
    }

    get mesh() {
        return this.#mesh;
    }
}

export { Earth };