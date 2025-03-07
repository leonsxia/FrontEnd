import { Mesh } from 'three';
import { BasicObject } from './BasicObject';
import { STAIRS_SIDE } from '../utils/constants';

class StairsSidePlane extends BasicObject {

    constructor(specs) {

        super(STAIRS_SIDE, specs);

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.name = specs.name;

        this.mesh.father = this;
        
    }

    async init () {

        await this.initBasic();

    }

    get width() {

        return this.geometry.parameters.width * this.mesh.scale.x;

    }

    get height() {

        return this.geometry.parameters.height * this.mesh.scale.y;

    }

    updateTexScale() {

        this.setConfig({ texScale: [this.scale.x, this.scale.y] })
        .updateTextures();

    }

}

export { StairsSidePlane };