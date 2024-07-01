import { createCameraHelper, createDirectialLightHelper } from '../components/helpers.js';

function setupShadowLight(scene, ...lights) {
    const shadowLightObjects = [];
    lights.forEach(l => {
        const { light, name } = l;
        switch (light.constructor.name) {
            case 'DirectionalLight':
                shadowLightObjects.push({
                    light: light,
                    lightHelper: createDirectialLightHelper(light),
                    lightShadowCamHelper: createCameraHelper(light.shadow.camera),
                    name: name
                });
                break;
        }
    });

    shadowLightObjects.forEach(lightObj => {
        const { light, lightHelper, lightShadowCamHelper } = lightObj;
        scene.add(light, lightHelper, lightShadowCamHelper);
        attachShadowCamProps(light);
        attachLightHelper(light, lightHelper, lightShadowCamHelper);
        addShadow(light);
    });

    // fix when change light position or target, the shadow camera won't update at first frame.
    updateLightCamera(shadowLightObjects, this.render.bind(this));
    return shadowLightObjects;
}

function addShadow(light) {
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    switch (light.constructor.name) {
        case 'DirectionalLight':
            {
                const w = 76;
                const h = 76;
                light.shadow.camera.width = w;
                light.shadow.camera.height = h;
                light.shadow.camera.near = 1;
                light.shadow.camera.far = 70;
                light.shadow.bias = 0.001;
            }
            break;
    }
}

function attachShadowCamProps(light) {
    switch (light.constructor.name) {
        case 'DirectionalLight':
            {
                const camera = light.shadow.camera;
                Object.defineProperty(camera, 'width', {
                    get() {
                        return this.right * 2;
                    },
                    set(value) {
                        this.left = value / - 2;
                        this.right = value / 2;
                    }
                });
                Object.defineProperty(camera, 'height', {
                    get() {
                        return this.top * 2;
                    },
                    set(value) {
                        this.bottom = value / - 2;
                        this.top = value / 2;
                    }
                });
            }
            break;
    }
}

function attachLightHelper(light, lightHelper, lightShadowCamHelper) {
    light['lightHelper'] = lightHelper;
    light['lightShadowCamHelper'] = lightShadowCamHelper;
}

function updateSingleLightCamera(lightObj, render, needRender = false) {
    switch (lightObj.light.constructor.name) {
        case 'DirectionalLight':
            {
                const { light, lightHelper, lightShadowCamHelper } = lightObj;
                // update the light target's matrixWorld because it's needed by the helper
                light.target.updateMatrixWorld();
                lightHelper.update();
                // update the light's shadow camera's projection matrix
                light.shadow.camera.updateProjectionMatrix();
                // and now update the camera helper we're using to show the light's shadow camera
                lightShadowCamHelper.update();
            }
            break;
    }
    if (needRender) render();
}

function updateLightCamera(lights, render) {
    lights.forEach(lightObj => {
        updateSingleLightCamera(lightObj, render);
    });
    render();
}

export { setupShadowLight, updateSingleLightCamera };