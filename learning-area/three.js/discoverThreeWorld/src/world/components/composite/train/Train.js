import { Group, Box3, Box3Helper, Vector3 } from 'three';
import { createMeshes } from './meshes';
import { Moveable2D } from '../../movement/Moveable2D';

class Train extends Moveable2D {
    name = '';
    group;
    meshes;
    w;
    d;
    h;
    boundingBox;
    boundingBoxHelper;
    vel;

    constructor(name) {
        super();
        this.name = name;
        this.group = new Group();
        this.meshes = createMeshes();

        const {
            cabin, chimney, nose, smallWheelFront, smallWheelCenter, smallWheelRear, bigWheel,
            boundingBox, width, depth, height
        } = this.meshes;
        this.group.add(
            cabin, nose, chimney, smallWheelRear, smallWheelCenter, smallWheelFront, bigWheel,
            boundingBox
        );
        this.w = width;
        this.d = depth;
        this.h = height;

        this.boundingBox = new Box3();
        this.boundingBoxHelper = new Box3Helper(this.boundingBox, 0x00ff00);
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
        return this.w * this.group.scale.x;
    }

    get height() {
        return this.h * this.group.scale.y;
    }

    get depth() {
        return this.d * this.group.scale.z;
    }

    get leftCorVec3() {
        return new Vector3(this.w / 2, 0, this.d / 2);
    }

    get rightCorVec3() {
        return new Vector3(- this.w / 2, 0, this.d / 2);
    }

    get leftBackCorVec3() {
        return new Vector3(this.w / 2, 0, - this.d / 2);
    }

    get rightBackCorVec3() {
        return new Vector3( - this.w / 2, 0, - this.d / 2);
    }

    get velocity() {
        return this.isAccelerating ? 13.89 : 2.55;
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

    setTickParams(delta) {
        const radius = 3;
        const R = this.isAccelerating ? radius * 2.5 : radius;
        const Rl = 0.8;
        const Rs = 0.4;
        const rotateVel = this.velocity / R;
        const smallWheelRotateVel = this.velocity / Rs;
        const largeWheelRotateVel = this.velocity / Rl;
        const dist = this.velocity * delta;
        const params = {
            group: this.group, R, rotateVel, dist, delta, 
            smallWheelRotateVel, largeWheelRotateVel
        };

        return params;
    }
    
    tick(delta) {
        const params = this.setTickParams(delta);
        this.tankmoveTick(params);
        this.tickWheels(delta, params);
        this.updateBoundingBoxHelper();
    }

    tickWithWall(delta, wall) {
        const params = this.setTickParams(delta);
        params.wall = wall;
        params.wall.position.y = 0;
        this.tankmoveTickWithWall(params);
        this.tickWheels(delta, params);
        this.updateBoundingBoxHelper();
    }

    tickWheels(delta, params) {
        const { smallWheelRotateVel, largeWheelRotateVel } = params;
        if (this.isForward) {
            this.meshes.bigWheel.rotation.x += delta * largeWheelRotateVel;
            this.meshes.smallWheelFront.rotation.x += delta * smallWheelRotateVel;
            this.meshes.smallWheelCenter.rotation.x += delta * smallWheelRotateVel;
            this.meshes.smallWheelRear.rotation.x += delta * smallWheelRotateVel;
        }else if (this.isBackward) {
            this.meshes.bigWheel.rotation.x -= delta * largeWheelRotateVel;
            this.meshes.smallWheelFront.rotation.x -= delta * smallWheelRotateVel;
            this.meshes.smallWheelCenter.rotation.x -= delta * smallWheelRotateVel;
            this.meshes.smallWheelRear.rotation.x -= delta * smallWheelRotateVel;
        }
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
}

export { Train };