import { DirectionalLight, PointLight, AmbientLight, HemisphereLight } from 'three';

function createLights(directLightSpecs, spotLightSpecs, ambientLightSpecs, hemisphereLightSpecs) {
    const mainLight = new DirectionalLight(directLightSpecs.color, directLightSpecs.intensity);
    const pointLight = new PointLight(spotLightSpecs.color, spotLightSpecs.intensity, spotLightSpecs.distance, spotLightSpecs.decay);
    const ambientLight = new AmbientLight(ambientLightSpecs.color, ambientLightSpecs.intensity);
    const hemisphereLight = new HemisphereLight(hemisphereLightSpecs.skyColor, hemisphereLightSpecs.groundColor, hemisphereLightSpecs.intensity);

    // move the light right, up and towards us
    mainLight.position.set(...directLightSpecs.position);
    pointLight.position.set(...spotLightSpecs.position);
    hemisphereLight.position.set(...hemisphereLightSpecs.position);

    return { mainLight, pointLight, ambientLight, hemisphereLight };
}

export { createLights };