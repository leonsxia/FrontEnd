import { WeaponBase } from '../../Models';
import { AMMOS, GLTF_NAMES, WEAPONS } from '../../utils/constants';
import { Ammo } from './Ammo';

const GLTF_SRC = 'weapons/smg1.glb';

class SMGShort extends WeaponBase {

    constructor(specs) {

        const superSpecs = {
            weaponType: WEAPONS.SMG_SHORT,
            gltfName: GLTF_NAMES.SMG_SHORT_ITEM,
            name: null,
            scale: [.15, .15, .15],
            position: [0, 0, 0], 
            rotation: [0, 0, 0],
            receiveShadow: true, 
            castShadow: true,
            src: GLTF_SRC,
            damageRange: 9,
            attackInterval: 0.08,
            fireRate: 10.2,
            ammo: new Ammo({ type: AMMOS.SMG, count: 35, damage: 7, offset: - 2, offset1: 2 }),
            magzineCapacity: 35,
            isSemiAutomatic: false
        };

        Object.assign(superSpecs, specs);

        super(superSpecs);

    }

}

export { SMGShort };