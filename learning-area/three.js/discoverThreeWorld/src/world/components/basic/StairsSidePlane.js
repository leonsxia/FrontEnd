import { Mesh, MeshPhongMaterial, TextureLoader } from 'three';
import { BasicObject } from './BasicObject';

class StairsSidePlane extends BasicObject {

    constructor(specs) {

        super('stairsSide', specs);

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.name = specs.name;
        
    }

    async init () {

        const { map, normalMap } = this.specs;

        const [texture, normal] = await Promise.all([
            map ? new TextureLoader().loadAsync(map) : Promise.resolve(null),
            normalMap ? new TextureLoader().loadAsync(normalMap) : Promise.resolve(null)
        ]);

        if (texture) {

            this.setTexture(texture);
            
        }

        if (normal) {

            this.setTexture(normal);

        }

        if (texture || normal) 
            this.mesh.material = this.material = new MeshPhongMaterial({ map: texture, normalMap: normal });

    }

    get width() {

        return this.geometry.parameters.width * this.mesh.scale.x;

    }

    get height() {

        return this.geometry.parameters.height * this.mesh.scale.y;

    }
}

export { StairsSidePlane };