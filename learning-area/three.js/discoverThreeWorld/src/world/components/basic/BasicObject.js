import { PlaneGeometry, BoxGeometry, SphereGeometry, MeshStandardMaterial, TextureLoader, SRGBColorSpace } from 'three';

class BasicObject {
    #map = null;
    geometry = null;
    material = null;
    mesh = null;

    constructor(type, specs) {
        const { basicMaterial } = specs;
        switch (type) {
            case 'plane':
                {
                    const { width, height } = specs;
                    this.geometry = new PlaneGeometry(width, height);
                }
                break;
            case 'box':
                {
                    const { size: { width, height, depth } } = specs;
                    this.geometry = new BoxGeometry(width, height, depth);
                }
                break;
            case 'sphere':
                const { size: { radius, widthSegments, heightSegments } } = specs;
                this.geometry = new SphereGeometry(radius, widthSegments, heightSegments);
                break;
        }
        this.material = basicMaterial;
    }

    async initBasic(specs) {
        const [map] = await Promise.all([new TextureLoader().loadAsync(specs.map)]);
        this.#map = map;
        this.#map.colorSpace = SRGBColorSpace;
        this.mesh.material = this.material = new MeshStandardMaterial({ map: this.#map });
    }

    setPosition(pos) {
        this.mesh.position.set(...pos);
    }

    setRotation(trans) {
        this.mesh.rotation.set(...trans);
    }

    castShadow(cast) {
        this.mesh.castShadow = cast;
    }

    receiveShadow(receive) {
        this.mesh.receiveShadow = receive;
    }
}

export { BasicObject };