import { MathUtils } from 'three';
import { 
    createCameraHelper, 
    createDirectialLightHelper, 
    createHemisphereLightHelper, 
    createPointLightHelper,
    createSpotLightHelper 
} from './utils/helpers.js';

function setupShadowLight(scene, ...lights) {
    const shadowLightObjects = []; // new object combine specs and light
    lights.filter(l => l.visible).forEach(l => {
        const { light, name, debug, shadow, shadow_debug, helper_show, shadow_cam_show } = l;
        switch (light.type) {
            case 'DirectionalLight':
                addShadowLightObject(shadowLightObjects, l, createDirectialLightHelper(light));
                break;
            case 'HemisphereLight':
                if (debug) {
                    const lightObject = {
                        light,
                        lightHelper: createHemisphereLightHelper(light),
                        name, debug, shadow, shadow_debug, helper_show, shadow_cam_show
                    }
                    shadowLightObjects.push(lightObject);
                } else {
                    shadowLightObjects.push({
                        light, name, debug, shadow, shadow_debug, helper_show, shadow_cam_show
                    });
                }
                break;
            case 'PointLight':
                addShadowLightObject(shadowLightObjects, l, createPointLightHelper(light));
                break;
            case 'SpotLight':
                addShadowLightObject(shadowLightObjects, l, createSpotLightHelper(light));
                break;
            default:
                shadowLightObjects.push({
                    light, name, debug, shadow, shadow_debug
                });
                break;
        }
    });

    shadowLightObjects.forEach(lightObj => {
        const { light } = lightObj;
        scene.add(light);   // add light to scene
        if (lightObj.debug) {
            const { lightHelper, lightShadowCamHelper } = lightObj;
            if (lightHelper) scene.add(lightHelper);
            if (lightObj.shadow_debug) {
                if (lightShadowCamHelper) scene.add(lightShadowCamHelper);
            }
            if (lightHelper) attachLightHelper(lightObj, lightHelper, lightShadowCamHelper);
        }
        if (lightObj.shadow) {
            attachShadowCamProps(light); // add width and height to directional light for shadow setup
            addShadow(light);
        }
    });

    // fix when change light position or target, 
    // the shadow camera won't update at first static frame.
    updateLightCamera.call(this, shadowLightObjects);
    return shadowLightObjects;
}

function addShadowLightObject(shadowLightObjects, lightSpecs, lightHelper) {
    const { light, name, debug, shadow, shadow_debug, helper_show, shadow_cam_show } = lightSpecs;
    if (debug) {
        const shadowLightObject = {
            light,
            lightHelper,
            name, debug, shadow, shadow_debug, helper_show, shadow_cam_show
        };
        if (shadow_debug) {
            Object.assign(shadowLightObject, {
                lightShadowCamHelper: createCameraHelper(light.shadow.camera)
            });
        }
        shadowLightObjects.push(shadowLightObject);
    } else {
        shadowLightObjects.push({
            light, name, debug, shadow, shadow_debug, helper_show, shadow_cam_show
        });
    }
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
        case 'SpotLight':
            {
                light.shadow.camera.fov = 50;
                light.shadow.camera.aspect = 1;
                light.shadow.camera.near = 0.5;
                light.shadow.camera.far = 500;
            }
            break;
    }
}

function attachShadowCamProps(light) {
    switch (light.type) {
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
        case 'SpotLight':
            {
                Object.defineProperty(light, 'angleDeg', {
                    get() {
                        return MathUtils.radToDeg(this.angle);
                    },
                    set(value) {
                        this.angle = MathUtils.degToRad(value);
                    }
                })
            }
            break;
    }
}

function attachLightHelper(lightObj, lightHelper, lightShadowCamHelper) {
    const { light, helper_show, shadow_cam_show } = lightObj;
    light['lightHelper'] = lightHelper;
    if (!helper_show) lightHelper.visible = false;
    if (lightShadowCamHelper) {
        light['lightShadowCamHelper'] = lightShadowCamHelper;
        if (!shadow_cam_show) lightShadowCamHelper.visible = false;
    }
}

function updateLightAndShadowCamHelper(lightObj) {
    const { light, lightHelper, lightShadowCamHelper } = lightObj;
    // update the light target's matrixWorld because it's needed by the helper
    light.target.updateMatrixWorld(); // update when debug is false, and manually change the light target
    if (lightObj.debug) lightHelper.update();
    // update the light's shadow camera's projection matrix
    light.shadow.camera.updateProjectionMatrix();
    // and now update the camera helper we're using to show the light's shadow camera
    if (lightObj.debug && lightObj.shadow_debug) lightShadowCamHelper.update();
}

function updateSingleLightCamera(lightObj, needRender = false) {
    switch (lightObj.light.type) {
        case 'DirectionalLight':
            updateLightAndShadowCamHelper(lightObj);
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
                if (lightObj.debug && lightObj.shadow_debug) lightShadowCamHelper.update();
            }
            break;
        case 'SpotLight':
            updateLightAndShadowCamHelper(lightObj);
            break;
    }
    if (needRender) this.render();
}

function updateLightCamera(lights) {
    lights.forEach(lightObj => {
        updateSingleLightCamera.call(this, lightObj);
    });
    this.render();  // need render twice to update the shadow camera helper.
}

export { setupShadowLight, updateSingleLightCamera };