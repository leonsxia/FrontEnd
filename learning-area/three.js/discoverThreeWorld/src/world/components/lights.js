import { DirectionalLight, PointLight, AmbientLight, HemisphereLight, Color } from 'three';

function colorStr(r, g, b) {
    return `rgb(${r},${g},${b})`;
}

function createBasicLights(basicLightSpecsArr) {
    const lights = {};
    basicLightSpecsArr.forEach(spec => {
        switch (spec.type) {
            case 'directional':
                {
                    const { name, detail: { color, intensity, position } } = spec;
                    lights[name] = new DirectionalLight(new Color(colorStr(...color)), intensity);
                    lights[name].position.set(...position);
                    spec.light = lights[name];
                }
                break;
            case 'ambient':
                {
                    const { name, detail: { color, intensity } } = spec;
                    lights[name] = new AmbientLight(new Color(colorStr(...color)), intensity);
                    spec.light = lights[name];
                }
                break;
            case 'hemisphere':
                {
                    const { name, detail: { color, groundColor, skyColor, intensity, position } } = spec;
                    lights[name] = new HemisphereLight(new Color(colorStr(...skyColor)), new Color(colorStr(...groundColor)), intensity);
                    lights[name].position.set(...position);
                    spec.light = lights[name];
                }
                break;
        }
    });

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