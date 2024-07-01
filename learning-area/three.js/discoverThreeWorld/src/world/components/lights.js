import { DirectionalLight, PointLight, AmbientLight, HemisphereLight, Color } from 'three';

function createLights(directLightSpecs, pointLightSpecs, ambientLightSpecs, hemisphereLightSpecs) {
    const mainLight = new DirectionalLight(new Color(colorStr(...directLightSpecs.color)), directLightSpecs.intensity);
    const pointLight = new PointLight(new Color(colorStr(...pointLightSpecs.color)), pointLightSpecs.intensity, pointLightSpecs.distance, pointLightSpecs.decay);
    const ambientLight = new AmbientLight(new Color(colorStr(...ambientLightSpecs.color)), ambientLightSpecs.intensity);
    const hemisphereLight = new HemisphereLight(new Color(colorStr(...hemisphereLightSpecs.skyColor)), new Color(colorStr(...hemisphereLightSpecs.groundColor)), hemisphereLightSpecs.intensity);

    // move the light right, up and towards us
    mainLight.position.set(...directLightSpecs.position);
    pointLight.position.set(...pointLightSpecs.position);
    hemisphereLight.position.set(...hemisphereLightSpecs.position);

    return { mainLight, pointLight, ambientLight, hemisphereLight };
}

function colorStr(r, g, b) {
    return `rgb(${r},${g},${b})`;
}

export { createLights };