import { Object3D } from 'three';

class SimplePhysics {
    players = [];
    floors = []
    walls = [];
    obstacles = [];
    activePlayers = [];

    constructor(players, floors, walls, obstacles) {
        this.players = players;
        this.walls = walls;
        this.floors = floors;
        this.obstacles = obstacles;
    }

    addActivePlayers(...names) {
        names.forEach(name => {
            const find = this.players.find(p => p.name === name);
            if (find) this.activePlayers.push(find);
        });
    }

    removeActivePlayers(...names) {
        names.forEach((name) => {
            const idx = this.activePlayers.findIndex(active => active.name === name);
            if (idx > -1) this.activePlayers.splice(find, 1);
        })
    }

    checkIntersection(player, plane, delta) {
        let intersect = false;
        const dummyObject = new Object3D();
        dummyObject.position.copy(plane.mesh.worldToLocal(player.position.clone()));
        dummyObject.rotation.y = player.rotation.y - plane.mesh.rotationY;
        dummyObject.scale.copy(player.scale);
        
        const leftCorVec3 = player.leftCorVec3;
        const rightCorVec3 = player.rightCorVec3;
        const leftBackCorVec3 = player.leftBackCorVec3;
        const rightBackCorVec3 = player.rightBackCorVec3;

        dummyObject.localToWorld(leftCorVec3);
        dummyObject.localToWorld(rightCorVec3);
        dummyObject.localToWorld(leftBackCorVec3);
        dummyObject.localToWorld(rightBackCorVec3);

        const halfPlayerDepth = Math.max(Math.abs(leftCorVec3.z - rightBackCorVec3.z), Math.abs(rightCorVec3.z - leftBackCorVec3.z)) / 2;
        const halfPlayerWidth = Math.max(Math.abs(leftCorVec3.x - rightBackCorVec3.x), Math.abs(rightCorVec3.x - leftBackCorVec3.x)) / 2;
        if ((leftCorVec3.z <=0 || rightCorVec3.z <= 0 || leftBackCorVec3.z <= 0 || rightBackCorVec3.z <= 0) 
            && Math.abs(dummyObject.position.z) - halfPlayerDepth <= 0
        ) {
            const halfEdgeLength = plane.width / 2;
            const padding = player.velocity * delta + 0.1;
            if (
                (Math.abs(dummyObject.position.z - halfPlayerDepth) <=  padding) && 
                (
                    (
                        ((leftCorVec3.z <= 0 || rightCorVec3.z <= 0) && (leftCorVec3.x < - plane.width / 2) && (rightCorVec3.x > plane.width / 2)) ||
                        ((leftBackCorVec3.z <= 0 || rightBackCorVec3.z <= 0) && (rightBackCorVec3.x < - plane.width / 2) && (leftBackCorVec3.x > plane.width / 2))
                    ) ||
                    (
                        // (player.isForward || player.isBackward) && 
                        (
                            (leftCorVec3.z <= 0 && Math.abs(leftCorVec3.x) <= halfEdgeLength) || 
                            (rightCorVec3.z <= 0 && Math.abs(rightCorVec3.x) <= halfEdgeLength)||
                            (leftBackCorVec3.z <= 0 && Math.abs(leftBackCorVec3.x) <= halfEdgeLength) ||
                            (rightBackCorVec3.z <= 0 && Math.abs(rightBackCorVec3.x) <= halfEdgeLength)
                        )
                    )
                )
            ) {
                intersect = true;
            } 
            else if (Math.abs(dummyObject.position.z - halfPlayerDepth) >  player.velocity * delta) {
                const leftBorderIntersects = plane.leftRay.intersectObject(player.group);
                const rightBorderIntersects = plane.rightRay.intersectObject(player.group);
                if (
                    rightBorderIntersects.length > 0 ||
                    leftBorderIntersects.length > 0
                ) {
                    console.log('ray intersect');
                    const leftCorIntersectFace = leftBorderIntersects.length > 0 ? leftBorderIntersects[0].object.name : null;
                    const rightCorIntersectFace = rightBorderIntersects.length > 0 ? rightBorderIntersects[0].object.name : null;
                    intersect = true;
                    return { intersect, borderReach: true, leftCorIntersectFace, rightCorIntersectFace };
                }
                return { intersect, borderReach: false };
            }
        }

        return { intersect, borderReach: false };
    }

    tick(delta) {
        if (delta > 0.0333) { // lost frame when fps lower than 30fps
            return;
        }
        this.activePlayers.forEach(player => {
            player.setBoundingBoxHelperColor(0x00ff00);
            const collisionedWalls = [];
            this.walls.forEach(wall => {
                const checkResult = this.checkIntersection(player, wall, delta);
                if (checkResult.intersect) {
                // if (player.boundingBox.intersectsBox(wall.boundingBox)) {
                    player.setBoundingBoxHelperColor(0xff0000);
                    wall.checkResult = checkResult;
                    collisionedWalls.push(wall);
                } else {
                    wall.checkResult = { intersect: false, borderReach: false }
                }
            });

            if (collisionedWalls.length === 0) {
                player.tick(delta);
            } else {
                collisionedWalls.forEach(wall => {
                    player.tickWithWall(delta, wall);
                })
            }

            this.floors.forEach(floor => {
                if (player.boundingBox.intersectsBox(floor.boundingBox)) {
                    // to do
                    // player.tickWithFloor(delta, floor);
                }
            });
        });
    }
}

export { SimplePhysics };