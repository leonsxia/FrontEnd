import { DirectionalLight, PointLight, AmbientLight, HemisphereLight, Color } from 'three';

function colorStr(r, g, b) {
    return `rgb(${r},${g},${b})`;
}

function createBasicLights(directLightSpecs, ambientLightSpecs, hemisphereLightSpecs) {
    const lights = {};
    lights[directLightSpecs.name] = new DirectionalLight(new Color(colorStr(...directLightSpecs.detail.color)), directLightSpecs.detail.intensity);
    lights[ambientLightSpecs.name] = new AmbientLight(new Color(colorStr(...ambientLightSpecs.detail.color)), ambientLightSpecs.detail.intensity);
    lights[hemisphereLightSpecs.name] = new HemisphereLight(new Color(colorStr(...hemisphereLightSpecs.detail.skyColor)), new Color(colorStr(...hemisphereLightSpecs.detail.groundColor)), hemisphereLightSpecs.detail.intensity);

    lights[directLightSpecs.name].position.set(...directLightSpecs.detail.position);
    lights[hemisphereLightSpecs.name].position.set(...hemisphereLightSpecs.detail.position);

    directLightSpecs.light = lights[directLightSpecs.name];
    ambientLightSpecs.light = lights[ambientLightSpecs.name];
    hemisphereLightSpecs.light = lights[hemisphereLightSpecs.name];

    return lights;
}

function createPointLights(pointLightSpecsArr) {
    const pointLights = {};
    pointLightSpecsArr.forEach(point => {
        const { name, detail: { color, position, intensity, distance, decay } } = point;
        const pointLight = new PointLight(new Color(colorStr(...color)), intensity, distance, decay);
        pointLight.position.set(...position);
        pointLights[name] = pointLight;
        point.light = pointLight;
    });
    return pointLights;
}

export { createBasicLights, createPointLights };