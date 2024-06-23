import { BoxGeometry, Mesh, MeshStandardMaterial, TextureLoader, SRGBColorSpace} from 'three'

function createCube(spc = {}) {
    // create a geometry
    const geometry = new BoxGeometry(2, 2, 2);

    // create a default (white) basic material
    // switch the old "basic" material to a physically correct "standard" materail
    const texture = new TextureLoader().load('images/crate.gif');
    texture.colorSpace = SRGBColorSpace;
    const material = new MeshStandardMaterial({map: texture});

    // create a mesh containing the geometry and material
    const cube = new Mesh(geometry, material);

    return cube;
}

export { createCube };