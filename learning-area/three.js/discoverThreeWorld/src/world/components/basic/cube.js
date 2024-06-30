import { BoxGeometry, Mesh, MeshStandardMaterial, TextureLoader, MathUtils, SRGBColorSpace } from 'three'

let material = new MeshStandardMaterial({ color: 0x050505 });
let cube = null;

async function loadMaterial(spc) {
    const textureLoader = new TextureLoader();
    const [map] = await Promise.all([textureLoader.loadAsync(spc.map)])
    map.colorSpace = SRGBColorSpace;
    cube.material = material = new MeshStandardMaterial({map: map});
    // cube.onTextureLoad();
}

function createCube(spc = {}) {
    // create a geometry
    const geometry = new BoxGeometry(spc.size.width, spc.size.height, spc.size.depth);

    // create a default (white) basic material
    // switch the old "basic" material to a physically correct "standard" materail
    // createMaterial(spc);

    // create a mesh containing the geometry and material
    cube = new Mesh(geometry, material);
    cube.name = spc.name;

    const radiansPerSecond = MathUtils.degToRad(30);

    // this method will be called once per frame
    cube.tick = (delta) => {
        // increase the cube's rotation each frame
        cube.rotation.z += radiansPerSecond * delta;
        cube.rotation.x += radiansPerSecond * delta;
        cube.rotation.y += radiansPerSecond * delta;
    };

    return cube;
}

export { createCube, loadMaterial };