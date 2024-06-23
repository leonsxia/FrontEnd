import { SphereGeometry,  Mesh, MeshStandardMaterial, TextureLoader, SRGBColorSpace, MathUtils } from 'three'

let material = new MeshStandardMaterial({ color: 0x050505 });
let sphere = null;

async function loadMaterial(spc) {
    const textureLoader = new TextureLoader();
    const [map] = await Promise.all([textureLoader.loadAsync(spc.map)])
    map.colorSpace = SRGBColorSpace;
    sphere.material = material = new MeshStandardMaterial({ map: map });
    // sphere.onTextureLoad();
}

function createSphere(spc = {}) {
    // create a geometry
    const geometry = new SphereGeometry(spc.size.radius, spc.size.widthSegments, spc.size.heightSegments);

    // create a default (white) basic material
    // switch the old "basic" material to a physically correct "standard" materail
    // createMaterial(spc);

    // create a mesh containing the geometry and material
    sphere = new Mesh(geometry, material);
    sphere.name = spc.name;

    const radiansPerSecond = MathUtils.degToRad(8.59);

    sphere.tick = (delta) => {
        sphere.rotation.y += delta * radiansPerSecond;
    }

    return sphere;
}

export { createSphere, loadMaterial };