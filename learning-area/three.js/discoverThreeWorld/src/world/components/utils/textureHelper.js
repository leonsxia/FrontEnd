import { TextureLoader, SRGBColorSpace} from 'three';

function getTextureLoader() {

    const loader = new TextureLoader();

    return loader;

}

const worldTextureLoader = getTextureLoader();
const loadedTextures = {};

async function loadSingleTexture(specs) {

    const { map, normalMap } = specs;
    const loader = worldTextureLoader;

    const [texture, normal] = await Promise.all([
        map ? loader.loadAsync(map) : Promise.resolve(null),
        normalMap ? loader.loadAsync(normalMap) : Promise.resolve(null)
    ]);

    return { texture, normal };

}

async function loadTextures(mapsArr) {

    const loadPromises = [];
    const loader = worldTextureLoader;
    const loaded = {};

    for (let i = 0, il = mapsArr.length; i < il; i++) {

        const m = mapsArr[i];
        const { name, map, normalMap } = m;

        if (map) {

            loaded[name] = null;
            loadPromises.push(loader.loadAsync(map));
            
        }

        if (normalMap) {

            loaded[`${name}_NORMAL`] = null;
            loadPromises.push(loader.loadAsync(normalMap));

        }

    }   

    const results = await Promise.all(loadPromises);

    let i = 0;
    for (let j = 0, jl = mapsArr.length; j < jl; j++) {

        const m = mapsArr[j];

        const { name, map, normalMap } = m;

        if (map) {

            results[i].colorSpace = SRGBColorSpace;
            loaded[name] = results[i];
            i++;

        }

        if (normalMap) {

            loaded[`${name}_NORMAL`] = results[i];
            i++;

        }
        
    }

    return loaded;

}

export { worldTextureLoader, loadSingleTexture, loadTextures, loadedTextures };