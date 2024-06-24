import { BoxGeometry, Mesh, MeshStandardMaterial, TextureLoader, SRGBColorSpace, MathUtils } from 'three'

class BoxCube {
    #map = null;
    #boxGeometry = null;
    #material = null;
    #mesh = null;
    #radiansPerSecond = MathUtils.degToRad(8.59);

    constructor(specs) {
        this.#material = new MeshStandardMaterial({ color: '#050505' });
        
        this.#boxGeometry = new BoxGeometry(specs.size.width, specs.size.height, specs.size.depth);

        this.#mesh = new Mesh(this.#boxGeometry, this.#material);
        this.#mesh.name = specs.name;
        // this.init(specs);
    }

    async init (specs) {
        const [map] = await Promise.all([new TextureLoader().loadAsync(specs.map)]);
        this.#map = map;
        this.#map.colorSpace = SRGBColorSpace;
        this.#mesh.material = this.#material = new MeshStandardMaterial({ map: this.#map });
        // this.onTextureLoad();
    }

    setPosition(pos) {
        this.#mesh.position.set(...pos);
    }

    setRotation(trans) {
        this.#mesh.rotation.set(...trans);
    }

    get mesh() {
        return this.#mesh;
    }

    onTextureLoad() {}

    tick(delta) {
        this.#mesh.rotation.y += delta * this.#radiansPerSecond;
    }
}

export { BoxCube };