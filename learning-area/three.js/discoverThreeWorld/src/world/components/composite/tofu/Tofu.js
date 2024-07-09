import { Group, Box3, Box3Helper, Vector3 } from 'three';
import { createMeshes } from './meshes';
import { Moveable2D } from '../../movement/Moveable2D';

class Tofu extends Moveable2D {
    name = '';
    group;
    meshes;
    #w;
    #d;
    #h;
    #rotateR = 2;
    boundingBox;
    boundingBoxHelper;
    vel;

    constructor(name) {
        super();
        this.name = name;
        this.group = new Group();
        this.meshes = createMeshes();
        const { body, slotLeft, slotRight, boundingBox, width, depth, height } = this.meshes;
        this.group.add(
            body, slotLeft, slotRight, boundingBox
        ).name = name;
        this.#w = width;
        this.#d = depth;
        this.#h = height;

        this.boundingBox = new Box3();
        this.boundingBoxHelper = new Box3Helper(this.boundingBox, 0x00ff00);
        this.boundingBoxHelper.name = `${name}-box-helper`;
    }

    get boundingBoxMesh() {
        return this.group.getObjectByName('boundingBox');
    }

    get position() {
        return this.group.position;
    }

    get rotation() {
        return this.group.rotation;
    }

    get scale() {
        return this.group.scale;
    }

    get width() {
        return this.#w * this.group.scale.x;
    }

    get height() {
        return this.#h * this.group.scale.y;
    }

    get depth() {
        return this.#d * this.group.scale.z;
    }

    get leftCorVec3() {
        return new Vector3(this.#w / 2, 0, this.#d / 2);
    }

    get rightCorVec3() {
        return new Vector3(- this.#w / 2, 0, this.#d / 2);
    }

    get leftBackCorVec3() {
        return new Vector3(this.#w / 2, 0, - this.#d / 2);
    }

    get rightBackCorVec3() {
        return new Vector3( - this.#w / 2, 0, - this.#d / 2);
    }

    get velocity() {
        return this.isAccelerating ? 13.89 : 6;
    }

    updateBoundingBoxHelper() {
        const { matrixWorld, geometry: { boundingBox } } = this.boundingBoxMesh;
        this.group.updateMatrixWorld();
        this.boundingBox.copy(boundingBox).applyMatrix4(matrixWorld);
        // this.boundingBoxHelper.updateMatrixWorld();
    }

    setBoundingBoxHelperColor(color) {
        this.boundingBoxHelper.material.color.setHex(color);
    }

    setPosition(pos) {
        this.group.position.set(...pos);
    }

    setRotation(rot) {
        this.group.rotation.set(...rot);
    }

    setScale(scale) {
        this.group.scale.set(...scale);
    }

    castShadow(cast) {
        this.group.children.forEach(child => {
            if (child.isMesh) {
                child.castShadow = cast;
            }
        });
    }

    receiveShadow(receive) {
        this.group.children.forEach(child => {
            if (child.isMesh) {
                child.receiveShadow = receive;
            }
        });
    }

    setTickParams(delta) {
        const R = this.isAccelerating ? this.#rotateR * 2 : this.#rotateR;
        const rotateVel = this.velocity / R;
        const dist = this.velocity * delta;
        const params = {
            group: this.group, R, rotateVel, dist, delta
        };

        return params;
    }

    tick(delta) {
        const params = this.setTickParams(delta);
        this.tankmoveTick(params);
        this.updateBoundingBoxHelper();
    }

    tickWithWall(delta, wall) {
        const params = this.setTickParams(delta);
        params.wall = wall;
        params.wall.position.y = 0;
        this.tankmoveTickWithWall(params);
        this.updateBoundingBoxHelper();
    }
}

export { Tofu };