import { Logger } from "../../../systems/Logger";
import { CustomizedCreatureTofu, GLTFModel } from "../../Models";
import { AnimateWorkstation } from "../../animation/AnimateWorkstation";
import { BS, AI as AICodes } from "../../basic/colorBase";
import { CAMERA_RAY_LAYER } from "../../utils/constants";
import { polarity } from "../../utils/enums";

const DEBUG = false;
const DEBUG_EVENTS = false;

class CreatureBase extends CustomizedCreatureTofu {

    specs;

    _isNoticed = false;
    _isAttacking = false;

    gltf;

    #logger = new Logger(DEBUG, 'CreatureBase');
    #eventsLogger = new Logger(DEBUG_EVENTS, 'CreatureBase');

    AWS;

    _clips = {};
    _animationSettings = {};

    isCreature = true;

    _delta = 0;
    _i = 0;

    constructor(specs) {

        const { name } = specs;
        const { src, receiveShadow = true, castShadow = true, hasBones = true } = specs;
        const { offsetX = 0, offsetY = 0, offsetZ = 0 } = specs;
        const { width = .9, width2 = .9, depth = .9, depth2 = .9, height = 1.8, sovRadius = Math.max(width, width2, depth, depth2, height) } = specs;
        const { collisionSize = { width, depth, height } } = specs;
        const { rotateR = .9, vel = 0.7, turnbackVel = 2.5 * Math.PI, velEnlarge = 2.5, rotateREnlarge = 2.5 } = specs;
        const { clips, animationSetting } = specs;
        const { scale = [1, 1, 1], gltfScale = [1, 1, 1] } = specs;
        const { isActive = true, showBS = false, enableCollision = true, typeMapping = {} } = specs;
        const { createDefaultBoundingObjects = true } = specs;

        super({ 
            name, 
            size: { width, width2, depth, depth2, height, sovRadius }, collisionSize, 
            rotateR, vel, turnbackVel, velEnlarge, rotateREnlarge, 
            createDefaultBoundingObjects, enableCollision, typeMapping
        });

        this.specs = specs;
        this.isActive = isActive;

        Object.assign(this._clips, clips);
        Object.assign(this._animationSettings, animationSetting);
        
        // basic gltf model
        const gltfSpecs = { name: `${name}_gltf_model`, src, offsetX, offsetY, offsetZ, receiveShadow, castShadow, hasBones };

        // gltf model
        this.gltf = new GLTFModel(gltfSpecs);
        this.gltf.setScale(gltfScale);

        this.setScale(scale);

        this.showBS(showBS);

        this.group.add(this.gltf.group);

    }

    async init() {
        
        await Promise.all([this.gltf.init()]);

        this.showSkeleton(false);
        this.bindEvents();

        this.gltf.visible = true;

        this.AWS = new AnimateWorkstation({ model: this.gltf, clipConfigs: this._clips });
        this.AWS.init();

        this.trackResources();
        
    }

    trackResources() {

        super.trackResources();

        this.track(this.gltf?.skeleton);

    }

    bindEvents() {
    
        const type = 'visibleChanged';
        const listener = (event) => {

            this.#logger.log(`${this.gltf.name}: ${event.message}`);
            this.gltf.setLayers(CAMERA_RAY_LAYER);

        };

        this.gltf.addEventListener(type, listener);
        this.gltf.eventList.set(type, listener);

    }

    showSkeleton(show) {

        if (this.gltf.skeleton) {

            this.gltf.skeleton.visible = show;

        }

    }

    movingForward(val) {

        if (val) {

            if (!this.forward) {

                if (this._isAttacking) {

                    this.#logger.log(`walk in queue`);
                    this.AWS.previousAction = this.AWS.actions[this.typeMapping.walk.nick];
                    this.AWS.setActionWeightTimeScaleInCallback(this.typeMapping.walk.nick, 1, this._animationSettings.WALK_TIMESCALE);

                } else if (!this.rotating) {

                    this.#logger.log('idle to walk');
                    this.AWS.prepareCrossFade(this.AWS.actions[this.typeMapping.idle.nick], this.AWS.actions[this.typeMapping.walk.nick], this._animationSettings.IDLE_TO_WALK);

                } else if (this.rotating) {

                    this.#logger.log(`zero turn to walk turn`);
                    this.AWS.prepareCrossFade(this.AWS.actions[this.typeMapping.walk.nick], this.AWS.actions[this.typeMapping.walk.nick], this._animationSettings.WALK_TURN_TO_ZERO_TURN, 1);

                }

                super.movingForward(true);
                this.switchHelperComponents();

            }

        } else {

            if (this.forward) {

                if (this._isAttacking) {

                    if (this.rotating) {

                        this.#logger.log(`walk turn in queue 2`);
                        this.AWS.setActionWeightTimeScaleInCallback(this.typeMapping.walk.nick, this._animationSettings.TURN_WEIGHT, this._animationSettings.WALK_TIMESCALE);

                    } else {

                        this.#logger.log(`idle in queue 2`);
                        this.AWS.previousAction = this.AWS.actions[this.typeMapping.idle.nick];
                        this.AWS.setActionWeightTimeScaleInCallback(this.typeMapping.idle.nick, 1);
                        this.AWS.clearActionCallback(this.typeMapping.walk.nick);

                    }

                } else if (!this.rotating) {

                    this.#logger.log(`walk to idle`);
                    this.AWS.prepareCrossFade(this.AWS.actions[this.typeMapping.walk.nick], this.AWS.actions[this.typeMapping.idle.nick], this._animationSettings.WALK_TO_IDLE);

                } else {

                    this.#logger.log(`walk turn to zero turn`);
                    this.AWS.setActionEffectiveWeight(this.typeMapping.walk.nick, this._animationSettings.TURN_WEIGHT);

                }

                super.movingForward(false);
                this.switchHelperComponents();

            }

        }

    }

    movingLeft(val) {

        if (val) {

            if (this.turningRight) {

                this.movingRight(false);

            }
            
            if (!this.turningLeft) {

                if (!this.forward) {

                    if (this._isAttacking) {

                        this.#logger.log(`left turn in queue`);
                        this.AWS.previousAction = this.AWS.actions[this.typeMapping.walk.nick];
                        this.AWS.setActionWeightTimeScaleInCallback(this.typeMapping.walk.nick, this._animationSettings.TURN_WEIGHT, this._animationSettings.WALK_TIMESCALE);

                    } else {

                        this.#logger.log(`idle to left turn`);
                        this.AWS.prepareCrossFade(this.AWS.actions[this.typeMapping.idle.nick], this.AWS.actions[this.typeMapping.walk.nick], this._animationSettings.IDLE_TO_TURN, this._animationSettings.TURN_WEIGHT);

                    }

                    this.AWS.setActionEffectiveTimeScale(this.typeMapping.walk.nick, this._animationSettings.WALK_TIMESCALE);

                }

                super.movingLeft(true);
                this.switchHelperComponents();

            }

        } else {

            if (this.turningLeft) {

                if (!this.forward) {

                    if (this._isAttacking) {

                        this.#logger.log(`idle in queue 3`);
                        this.AWS.previousAction = this.AWS.actions[this.typeMapping.idle.nick];
                        this.AWS.setActionWeightTimeScaleInCallback(this.typeMapping.idle.nick, 1);
                        this.AWS.clearActionCallback(this.typeMapping.walk.nick);

                    } else {

                        this.#logger.log(`left turn to idle`);
                        this.AWS.prepareCrossFade(this.AWS.actions[this.typeMapping.walk.nick], this.AWS.actions[this.typeMapping.idle.nick], this._animationSettings.TURN_TO_IDLE);

                    }

                }

                super.movingLeft(false);
                this.switchHelperComponents();

            }

        }

    }

    movingRight(val) {

        if (val) {

            if (this.turningLeft) {

                this.movingLeft(false);

            }

            if (!this.turningRight) {

                if (!this.forward) {

                    if (this._isAttacking) {

                        this.#logger.log(`right turn in queue`);
                        this.AWS.previousAction = this.AWS.actions[this.typeMapping.walk.nick];

                        this.AWS.setActionWeightTimeScaleInCallback(this.typeMapping.walk.nick, this._animationSettings.TURN_WEIGHT);

                    } else {

                        this.#logger.log(`idle to right turn`);
                        this.AWS.prepareCrossFade(this.AWS.actions[this.typeMapping.idle.nick], this.AWS.actions[this.typeMapping.walk.nick], this._animationSettings.IDLE_TO_TURN, this._animationSettings.TURN_WEIGHT);

                    }

                    this.AWS.setActionEffectiveTimeScale(this.typeMapping.walk.nick, this._animationSettings.WALK_TIMESCALE);

                }

                super.movingRight(true);
                this.switchHelperComponents();

            }
            
        } else {

            if (this.turningRight) {

                if (!this.forward) {

                    if (this._isAttacking) {

                        this.#logger.log(`idle in queue 3`);
                        this.AWS.previousAction = this.AWS.actions[this.typeMapping.idle.nick];
                        this.AWS.setActionWeightTimeScaleInCallback(this.typeMapping.idle.nick, 1);
                        this.AWS.clearActionCallback(this.typeMapping.walk.nick);

                    } else {

                        this.#logger.log(`right turn to idle`);
                        this.AWS.prepareCrossFade(this.AWS.actions[this.typeMapping.walk.nick], this.AWS.actions[this.typeMapping.idle.nick], this._animationSettings.TURN_TO_IDLE);

                    }

                }

                super.movingRight(false);
                this.switchHelperComponents();

            }

        }

    }

    onSovSphereTriggerEnter(target) {

        this.#eventsLogger.func = this.onSovSphereTriggerEnter.name;
        this.#eventsLogger.log(`${this.name} sov sphere trigger entered by ${target.name}`);

        if (this._inSightTargets.length === 1) {

            this._isNoticed = true;
            this.sovBoundingSphereMesh.material.color.setHex(AICodes.targetInRange);

        }
        
    }

    onSovSphereTriggerExit(target) {

        this.#eventsLogger.func = this.onSovSphereTriggerExit.name;
        this.#eventsLogger.log(`${target.name} exited ${this.name}'s sov sphere trigger`);

        if (this._inSightTargets.length === 0) {

            this._isNoticed = false;
            this.sovBoundingSphereMesh.material.color.setHex(BS);

        }

    }

    onInSightTargetsCleared() {

        this._isNoticed = false;

    }

    onHealthReset() {

        this.die(false);

    }

    hurt(val) {

        this.#logger.func = this.hurt.name;

        if (val) {

            const hurtAction = this.AWS.actions[this.typeMapping.hurt.nick]
            if (this.AWS.activeAction === hurtAction) {

                const fadeToAction = this.AWS.cachedAction ?? this.AWS.previousAction;
                this.AWS.fadeToAction(fadeToAction, .1);
                this.AWS.isLooping = false;
                hurtAction.ignoreFinishedEvent = true;

            }

            const endCallback = () => {

                super.hurt(false);
                hurtAction.ignoreFinishedEvent = undefined;

            }

            this.#logger.log(`${this.name} is on hurt`);
            this.AWS.prepareCrossFade(null, hurtAction, this._animationSettings.HURT, 1, false, false, this._animationSettings.HURT, endCallback);

        } else {

            return;

        }

        super.hurt(val);

    }

    die(val) {

        this.#logger.func = this.die.name;

        if (val) {

            this.#logger.log(`${this.name} is dead`);

            const dieAction = this.AWS.actions[this.typeMapping.die.nick];
            const hurtAction = this.AWS.actions[this.typeMapping.hurt.nick];
            if (this.AWS.activeAction === hurtAction) {

                const fadeToAction = this.AWS.cachedAction ?? this.AWS.previousAction;
                this.AWS.fadeToAction(fadeToAction, .1);
                this.AWS.isLooping = false;
                hurtAction.ignoreFinishedEvent = true;
                hurtAction.ignoreFadeOut = true;

            }

            const endCallback = () => {

                this.isActive = false;
                hurtAction.ignoreFinishedEvent = undefined;
                hurtAction.ignoreFadeOut = undefined;
                this.AWS.isLooping = false;
                this.AWS.setActionEffectiveTimeScale(this.typeMapping.idle.nick, 1);

            }
            dieAction.ignoreFadeOut = true;
            this.AWS.cachedAction = this.AWS.previousAction = null;

            this.AWS.prepareCrossFade(null, dieAction, this._animationSettings.DIE, 1, false, false, 0, endCallback);

        }        

        super.die(val);

    }

    damageReceiveTick(params) {

        this.#logger.func = this.damageReceiveTick.name;

        const { damage } = params;

        this.health.current -= damage;

        if (this.health.currentLife > 0) {

            this.hurt(true);

        } else {
          
            this.clearInSightTargets();
            this.die(true);

        }

        if (this.forward || this.turningLeft || this.turningRight) {

            this.movingLeft(false);
            this.movingRight(false);
            this.movingForward(false);

        }

        if (this.dead) {

            this.setAllBoundingBoxLayers(false);

        }

    }

    movingTick() {

        this.#logger.func = this.movingTick.name;

        if (this.hurting || this.dead) {

            return;

        }

        if (this._isNoticed) {

            this._target = this.getNearestInSightTarget(null, this._inSightTargets, false);
            const { dirAngle } = this._target;

            if (dirAngle.angle < 0.01) {

                this.movingLeft(false);
                this.movingRight(false);

            } else if (dirAngle.angle > 0.26) {
                
                if (dirAngle.direction === polarity.left) {

                    this.movingLeft(true);

                } else {

                    this.movingRight(true);

                }

            }

            this.movingForward(true);

        } else {

            this.movingLeft(false);
            this.movingRight(false);
            this.movingForward(false);

        }

    }

    // inherited by child
    setInitialActions() {}

    resetAnimation() {

        this.AWS.resetAllActions();
        this.movingLeft(false);
        this.movingRight(false);
        this.movingForward(false);
        super.hurt(false);
        super.die(false);

    }

    mixerTick(delta) {

        this.AWS.mixer.update(delta);

    }

}

export { CreatureBase };