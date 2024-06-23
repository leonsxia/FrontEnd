import { SphereGeometry, Mesh, MeshStandardMaterial, MeshPhongMaterial, TextureLoader, SRGBColorSpace, MathUtils} from 'three';

class Earth {
    #surfaceMap = null;
    #normalMap = null;
    #specularMap = null;
    #material = null;
    #sphereGeometry = null;
    #mesh = null;
    #radiansPerSecond = MathUtils.degToRad(8.59);

    constructor(specs) {
        this.#material = new MeshStandardMaterial({ color: '#050505' });
        
        this.#sphereGeometry = new SphereGeometry(2, 32, 32);

        this.#mesh = new Mesh(this.#sphereGeometry, this.#material);
        this.#mesh.name = specs.name;
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
        this.#mesh.material = this.#material = new MeshPhongMaterial({ map: this.#surfaceMap, normalMap: this.#normalMap, specularMap: this.#specularMap, specular: 0x111111 });
        // this.onTextureLoad();
        
    }

    setPosition(pos) {
        this.#mesh.position.set(pos.x, pos.y, pos.z);
    }

    setRotation(trans) {
        this.#mesh.rotation.set(trans.x, trans.y, trans.z);
    }

    get mesh() {
        return this.#mesh;
    }

    onTextureLoad() {}

    tick(delta) {
        this.#mesh.rotation.y += delta * this.#radiansPerSecond;
    }
}

export { Earth };