import { BoxGeometry, SphereGeometry,  Mesh, MeshBasicMaterial, MeshStandardMaterial, TextureLoader, SRGBColorSpace } from 'three'

function createSphere(spc = {}) {
    // create a geometry
    const geometry = new SphereGeometry(2, 32, 32);

    // create a default (white) basic material
    // switch the old "basic" material to a physically correct "standard" materail
    const texture = new TextureLoader().load('images/earth_surface_2048.jpg');
    texture.colorSpace = SRGBColorSpace;
    const material = new MeshBasicMaterial({map: texture});

    // create a mesh containing the geometry and material
    const sphere = new Mesh(geometry, material);

    return sphere;
}

export { createSphere };