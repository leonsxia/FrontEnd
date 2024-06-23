import { AxesHelper, GridHelper } from 'three';

function createAxesHelper(spcs) {
    const helper = new AxesHelper(spcs.size);
    //   helper.position.set(-5.5, 0, -5.5);
    helper.position.set(spcs.position.x, spcs.position.y, spcs.position.z);

    return helper;
}

function createGridHelper(spcs) {
    const helper = new GridHelper(spcs.size, spcs.divisions);
    return helper;
}

export { createAxesHelper, createGridHelper };