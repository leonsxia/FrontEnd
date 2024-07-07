import { Mesh, MeshPhongMaterial, DoubleSide, Box3, Box3Helper, EdgesGeometry, LineSegments, LineBasicMaterial } from 'three';
import { BasicObject } from './BasicObject';

class Plane extends BasicObject {
    #map = null;
    boundingBox;
    boundingBoxHelper;

    constructor(specs) {
        super('plane', specs)
        const { name, color } = specs;
        this.material = new MeshPhongMaterial({ color: color });
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.name = name;
        this.geometry.computeBoundingBox();
        this.boundingBox = new Box3();
        this.boundingBoxHelper = new Box3Helper(this.boundingBox, 0xffffff);
        
        this.edges = new EdgesGeometry( this.geometry );
        this.line = new LineSegments( this.edges, new LineBasicMaterial( { color: 0xffffff } ) );

        this.updateBoundingBoxHelper();
    }

    async init (specs) {
        const { map } = specs;
        const [texture] = await Promise.all([
            map ? new TextureLoader().loadAsync(map) : new Promise(resolve => resolve(null))
        ]);
        if (texture) {
            this.#map = texture;
            this.#map.colorSpace = SRGBColorSpace;
            this.mesh.material = this.material = new MeshPhongMaterial({ map: this.#map });
        }
    }

    get width() {
        return this.geometry.parameters.width * this.mesh.scale.x;
    }

    get height() {
        return this.geometry.parameters.height * this.mesh.scale.y;
    }

    setRotationY(y) {
        this.setRotation([0, y, 0]);
        this.mesh.rotationY = y;
    }
    
    updateBoundingBoxHelper() {
        this.mesh.updateMatrixWorld();
        this.boundingBox.copy(this.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld);
        this.line.applyMatrix4(this.mesh.matrixWorld);
        // this.boundingBoxHelper.updateMatrixWorld();
    }

    setDoubleSide() {
        this.material.side = DoubleSide;
    }

    setDoubleShadowSide() {
        this.material.shadowSide = DoubleSide;
    }
}

export { Plane };