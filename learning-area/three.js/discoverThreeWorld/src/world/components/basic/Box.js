import { Mesh } from 'three'
import { BasicObject } from './BasicObject';
import { BOX } from '../utils/constants';

class Box extends BasicObject {

    constructor(specs) {

        super(BOX, specs);

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

    get depth() {

        return this.geometry.parameters.depth * this.mesh.scale.z;

    }
}

export { Box };