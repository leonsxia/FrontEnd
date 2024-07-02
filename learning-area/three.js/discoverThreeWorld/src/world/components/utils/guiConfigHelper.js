function combineGuiConfigs(...details) {
    let specs = [];
    details.forEach(detail => 
        specs = specs.concat(detail)
    );
    return specs;
}

function makeGuiPanel() {
    return {
        parents: {},
        details: []
    };
}

function makeFunctionGuiConfig(folder, parent) {
    return {
        folder,
        parent,
        specs: [{
            value: null,
            type: 'function'
        }]
    };
}

function makeDropdownGuiConfig(folder, parent, name, value, params, changeFn) {
    return {
        folder,
        parent,
        specs: [{
            name,
            value,
            params,
            type: 'scene-dropdown',
            changeFn
        }]
    }
}

function makeBasicLightGuiConfig(directLightSpecs, ambientLightSpecs, hemisphereLightSpecs) {
    const specs = [];
    // main directional light
    specs.push({
        folder: directLightSpecs.display,
        parent: directLightSpecs.name,
        specs: [{
            name: 'intensity',
            value: null,
            params: [0, 20],
            type: 'number'
        }, {
            name: 'color',
            value: directLightSpecs.detail,
            params: [255],
            type: 'color',
            changeFn: null
        }]
    });
    if (directLightSpecs.debug) {
        const find = specs.find(s => s.parent === directLightSpecs.name).specs;
        find.push({
            name: 'x',
            prop: 'position.x',
            value: null,
            sub: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'y',
            prop: 'position.y',
            value: null,
            sub: 'position',
            params: [0, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'z',
            prop: 'position.z',
            value: null,
            sub: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'x',
            prop: 'target.x',
            value: null,
            sub: 'target',
            subprop: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'y',
            prop: 'target.y',
            value: null,
            sub: 'target',
            subprop: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'z',
            prop: 'target.z',
            value: null,
            sub: 'target',
            subprop: 'position',
            params: [-25, 25],
            type: 'light-num',
            changeFn: null
        }, {
            name: 'visible',
            prop: 'light helper',
            value: null,
            sub: 'lightHelper',
            type: 'boolean'
        });

        if (directLightSpecs.shadow) {
            find.push({
                name: 'width',
                prop: 'shadow cam width',
                value: null,
                sub: 'shadow',
                subprop: 'camera',
                params: [1, 100],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'height',
                prop: 'shadow cam height',
                value: null,
                sub: 'shadow',
                subprop: 'camera',
                params: [1, 100],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'near',
                prop: 'shadow cam near',
                value: null,
                sub: 'shadow',
                subprop: 'camera',
                params: [0.1, 10, 0.1],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'far',
                prop: 'shadow cam far',
                value: null,
                sub: 'shadow',
                subprop: 'camera',
                params: [10, 100, 0.1],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'zoom',
                prop: 'shadow cam zoom',
                value: null,
                sub: 'shadow',
                subprop: 'camera',
                params: [0.01, 1.5, 0.01],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'visible',
                prop: 'shadow camera',
                value: null,
                sub: 'lightShadowCamHelper',
                type: 'boolean'
            });
        }
    }
    // ambient light
    if (ambientLightSpecs.visible) {
        specs.push({
            folder: ambientLightSpecs.display,
            parent: ambientLightSpecs.name,
            specs: [{
                name: 'intensity',
                value: null,
                params: [0, 20],
                type: 'number'
            }, {
                name: 'color',
                value: ambientLightSpecs.detail,
                params: [255],
                type: 'color'
            }]
        });
    }
    // hemisphere light
    if (hemisphereLightSpecs.visible) {
        specs.push({
            folder: hemisphereLightSpecs.display,
            parent: hemisphereLightSpecs.name,
            specs: [{
                name: 'intensity',
                value: null,
                params: [0, 50],
                type: 'number'
            }, {
                name: 'skyColor',
                value: hemisphereLightSpecs.detail,
                params: [255],
                type: 'color',
                changeFn: null
            }, {
                name: 'groundColor',
                value: hemisphereLightSpecs.detail,
                params: [255],
                type: 'groundColor',
                changeFn: null
            }]
        });

        if (hemisphereLightSpecs.debug) {
            const find = specs.find(s => s.parent === hemisphereLightSpecs.name).specs;
            find.push({
                name: 'x',
                prop: 'position.x',
                value: null,
                sub: 'position',
                params: [-25, 25],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'y',
                prop: 'position.y',
                value: null,
                sub: 'position',
                params: [0, 25],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'z',
                prop: 'position.z',
                value: null,
                sub: 'position',
                params: [-25, 25],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'visible',
                prop: 'light helper',
                value: null,
                sub: 'lightHelper',
                type: 'boolean'
            });
        }
    }

    return specs;
}

function makePointLightGuiConfig(pointLightSpecsArr) {
    const specs = [];
    pointLightSpecsArr.forEach(point => {
        specs.push({
            folder: point.display,
            parent: point.name,
            specs: [{
                name: 'intensity',
                value: null,
                params: [0, 100, 0.1],
                type: 'number'
            }, {
                name: 'power',
                value: null,
                params: [0, 1000, 1],
                type: 'number'
            }, {
                name: 'distance',
                value: null,
                params: [-0.5, 100, 0.01],
                type: 'number'
            }, {
                name: 'decay',
                value: null,
                params: [-10, 10, 0.01],
                type: 'number'
            }, {
                name: 'color',
                value: point.detail,
                params: [255],
                type: 'color',
                changeFn: null
            }]
        });
        if (point.debug) {
            const find = specs.find(s => s.parent === point.name).specs;
            find.push({
                name: 'x',
                prop: 'position.x',
                value: null,
                sub: 'position',
                params: [-25, 25],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'y',
                prop: 'position.y',
                value: null,
                sub: 'position',
                params: [0, 25],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'z',
                prop: 'position.z',
                value: null,
                sub: 'position',
                params: [-25, 25],
                type: 'light-num',
                changeFn: null
            }, {
                name: 'visible',
                prop: 'light helper',
                value: null,
                sub: 'lightHelper',
                type: 'boolean'
            });

            if (point.shadow) {
                find.push({
                    name: 'fov',
                    prop: 'shadow cam fov',
                    value: null,
                    sub: 'shadow',
                    subprop: 'camera',
                    params: [1, 100],
                    type: 'light-num',
                    changeFn: null
                }, {
                    name: 'aspect',
                    prop: 'shadow cam aspect',
                    value: null,
                    sub: 'shadow',
                    subprop: 'camera',
                    params: [0.5, 2],
                    type: 'light-num',
                    changeFn: null
                }, {
                    name: 'near',
                    prop: 'shadow cam near',
                    value: null,
                    sub: 'shadow',
                    subprop: 'camera',
                    params: [0.1, 10, 0.1],
                    type: 'light-num',
                    changeFn: null
                }, {
                    name: 'far',
                    prop: 'shadow cam far',
                    value: null,
                    sub: 'shadow',
                    subprop: 'camera',
                    params: [100, 1000, 0.1],
                    type: 'light-num',
                    changeFn: null
                }, {
                    name: 'zoom',
                    prop: 'shadow cam zoom',
                    value: null,
                    sub: 'shadow',
                    subprop: 'camera',
                    params: [0.01, 1.5, 0.01],
                    type: 'light-num',
                    changeFn: null
                }, {
                    name: 'visible',
                    prop: 'shadow camera',
                    value: null,
                    sub: 'lightShadowCamHelper',
                    type: 'boolean'
                });
            }
        }
    });
    return specs;
}

function makeSceneRightGuiConfig(directLightSpecs, ambientLightSpecs, hemisphereLightSpecs, pointLightSpecsArr) {
    const panel = makeGuiPanel();
    panel.details = combineGuiConfigs(
        makeBasicLightGuiConfig(directLightSpecs, ambientLightSpecs, hemisphereLightSpecs),
        makePointLightGuiConfig(pointLightSpecsArr)
    );
    return panel;
}


export { makeGuiPanel, makeFunctionGuiConfig, makeDropdownGuiConfig, makeSceneRightGuiConfig };