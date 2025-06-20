class CreatureTypeMapping {

    name;

    idle;
    walk;
    rotate;
    attack;
    hurt;
    die;

    idleToWalk;
    walkToIdle;

    walkTimeScale;

    idleCollisionSize;
    walkCollisionSize;

    idleBoundingFaceSize;
    walkBoundingFaceSize;
    rotateBoundingFaceSize;

    idleBoundingBoxSize;
    walkBoundingBoxSize;

    pushingBoxSize;

    constructor(specs) {

        const { name } = specs;
        const { idle, walk, walkTimeScale, rotate, attack, hurt, die, idleToWalk, walkToIdle } = specs;
        const { idleCollisionSize, walkCollisionSize } = specs;
        const { idleBoundingFaceSize, walkBoundingFaceSize, rotateBoundingFaceSize } = specs;
        const { idleBoundingBoxSize, walkBoundingBoxSize } = specs;
        const { pushingBoxSize } = specs;

        this.name = name;
        this.idle = idle;
        this.walk = walk;
        this.walkTimeScale = walkTimeScale;
        this.rotate = rotate;
        this.attack = attack;
        this.hurt = hurt;
        this.die = die;
        this.idleToWalk = idleToWalk;
        this.walkToIdle = walkToIdle;

        this.idleCollisionSize = idleCollisionSize;
        this.walkCollisionSize = walkCollisionSize;

        this.idleBoundingFaceSize = idleBoundingFaceSize;
        this.walkBoundingFaceSize = walkBoundingFaceSize;
        this.rotateBoundingFaceSize = rotateBoundingFaceSize;

        this.idleBoundingBoxSize = idleBoundingBoxSize;
        this.walkBoundingBoxSize = walkBoundingBoxSize;

        this.pushingBoxSize = pushingBoxSize;

    }

}

export { CreatureTypeMapping }