import { 
    createCameraHelper, 
    createDirectialLightHelper, 
    createHemisphereLightHelper, 
    createPointLightHelper 
} from './utils/helpers.js';

function setupShadowLight(scene, ...lights) {
    const shadowLightObjects = [];
    lights.filter(l => l.visible).forEach(l => {
        const { light, name, debug, shadow } = l;
        switch (light.constructor.name) {
            case 'DirectionalLight':
                if (debug) {
                    const shadowLightObject = {
                        light,
                        lightHelper: createDirectialLightHelper(light),
                        name, debug, shadow
                    };
                    if (shadow) {
                        Object.assign(shadowLightObject, {
                            lightShadowCamHelper: createCameraHelper(light.shadow.camera)
                        });
                    }
                    shadowLightObjects.push(shadowLightObject);
                } else {
                    shadowLightObjects.push({
                        light, name, debug, shadow
                    });
                }
                break;
            case 'HemisphereLight':
                if (debug) {
                    const lightObject = {
                        light,
                        lightHelper: createHemisphereLightHelper(light),
                        name, debug, shadow
                    }
                    shadowLightObjects.push(lightObject);
                } else {
                    shadowLightObjects.push({
                        light, name, debug, shadow
                    });
                }
                break;
            case 'PointLight':
                if (debug) {
                    const shadowLightObject = {
                        light,
                        lightHelper: createPointLightHelper(light),
                        name, debug, shadow
                    };
                    if (shadow) {
                        Object.assign(shadowLightObject, {
                            lightShadowCamHelper: createCameraHelper(light.shadow.camera)
                        });
                    }
                    shadowLightObjects.push(shadowLightObject);
                } else {
                    shadowLightObjects.push({
                        light, name, debug, shadow
                    });
                }
                break;
        }
    });

    shadowLightObjects.forEach(lightObj => {
        const { light } = lightObj;
        scene.add(light);
        if (lightObj.debug) {
            const { lightHelper, lightShadowCamHelper } = lightObj;
            scene.add(lightHelper);
            if (lightObj.shadow) {
                if (lightShadowCamHelper) scene.add(lightShadowCamHelper);
                attachShadowCamProps(light);
                addShadow(light);
            }
            attachLightHelper(light, lightHelper, lightShadowCamHelper);
        }
    });

    // fix when change light position or target, 
    // the shadow camera won't update at first static frame.
    updateLightCamera.call(this, shadowLightObjects);
    return shadowLightObjects;
}

function addShadow(light) {
    light.castShadow = true;
    light.shadow.mapSize.width = 1024; //2048;
    light.shadow.mapSize.height = 1024; //2048;
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
        case 'PointLight':
            {
                light.shadow.camera.fov = 90;
                light.shadow.camera.aspect = 1;
                light.shadow.camera.near = 0.5;
                light.shadow.camera.far = 500;
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
    lightHelper.visible = false;
    if (lightShadowCamHelper) {
        light['lightShadowCamHelper'] = lightShadowCamHelper;
        lightShadowCamHelper.visible = false;
    }
}

function updateSingleLightCamera(lightObj, needRender = false) {
    switch (lightObj.light.constructor.name) {
        case 'DirectionalLight':
            {
                const { light, lightHelper, lightShadowCamHelper } = lightObj;
                // update the light target's matrixWorld because it's needed by the helper
                light.target.updateMatrixWorld();
                if (lightObj.debug) lightHelper.update();
                // update the light's shadow camera's projection matrix
                light.shadow.camera.updateProjectionMatrix();
                // and now update the camera helper we're using to show the light's shadow camera
                if (lightObj.debug && lightObj.shadow) lightShadowCamHelper.update();
            }
            break;
        case 'HemisphereLight':
            {
                const { lightHelper } = lightObj;
                lightHelper.update();
            }
            break;
        case 'PointLight':
            {
                const { light, lightHelper, lightShadowCamHelper } = lightObj;
                if (lightObj.debug) lightHelper.update();
                light.shadow.camera.updateProjectionMatrix();
                if (lightObj.debug && lightObj.shadow) lightShadowCamHelper.update();
            }
            break;
    }
    if (needRender) this.render();
}

function updateLightCamera(lights) {
    lights.forEach(lightObj => {
        updateSingleLightCamera.call(this, lightObj);
    });
    this.render();
}

export { setupShadowLight, updateSingleLightCamera };