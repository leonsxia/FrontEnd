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

    checkIntersection(box, plane, delta) {
        let interesct = false;
        const dummyObject = new Object3D();
        dummyObject.position.copy(plane.mesh.worldToLocal(box.position.clone()));
        dummyObject.rotation.y = box.rotation.y - plane.mesh.rotationY;
        dummyObject.scale.copy(box.scale);
        
        const leftCorVec3 = box.leftCorVec3;
        const rightCorVec3 = box.rightCorVec3;
        const leftBackCorVec3 = box.leftBackCorVec3;
        const rightBackCorVec3 = box.rightBackCorVec3;

        dummyObject.localToWorld(leftCorVec3);
        dummyObject.localToWorld(rightCorVec3);
        dummyObject.localToWorld(leftBackCorVec3);
        dummyObject.localToWorld(rightBackCorVec3);
        if ((leftCorVec3.z <=0 || rightCorVec3.z <= 0 || leftBackCorVec3.z <= 0 || rightBackCorVec3.z <= 0) 
            && dummyObject.position.z > - box.velocity * delta) {
            const boxCenterX = dummyObject.position.x;
            const width = Math.max(Math.abs(leftCorVec3.x - rightBackCorVec3.x), Math.abs(rightCorVec3.x - leftBackCorVec3.x));
            if ((boxCenterX + width / 2 >= - plane.width / 2 && boxCenterX <= 0) ||
                (boxCenterX - width / 2 <= plane.width / 2 && boxCenterX >= 0)) {
                    interesct = true;
                }
        }

        return interesct
    }

    tick(delta) {
        this.activePlayers.forEach(player => {
            player.setBoundingBoxHelperColor(0x00ff00);
            const collisionedWalls = [];
            this.walls.forEach(wall => {
                if (this.checkIntersection(player, wall, delta)) {
                // if (player.boundingBox.intersectsBox(wall.boundingBox)) {
                    player.setBoundingBoxHelperColor(0xff0000);
                    collisionedWalls.push(wall);
                }
            });

            if (collisionedWalls.length === 0) {
                player.tick(delta);
            } else {
                collisionedWalls.forEach(wall => {
                    player.tickWithWall(delta, wall.mesh);
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