import { GUI } from 'lil-gui';
import Stats from 'stats.js';

class Gui {
    #guis = [];
    #stats = null;
    #objects = {};
    #attachedTo;
    #guiLoaded = false;
    #saveObj = null;
    #sceneChanged = false;

    constructor () {
        this.#guis.push(new GUI({ width: 140}));
        this.#guis.push(new GUI({ title: 'Objects Control' }));
        this.#guis.forEach(gui => gui.hide());
    }

    get stats() {
        return this.#stats;
    }

    get leftPanel() {
        return this.#guis[0];
    }

    init(specs) {
        this.#stats = new Stats();
        this.#stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.#stats.dom);
        if (this.#guiLoaded) return;
        this.#guiLoaded = true;
        Object.assign(Object.assign(this.#objects, specs.left.parents), specs.right.parents);
        this.#attachedTo = specs.attachedTo;
        this.initLeft(specs.left);
        this.initRight(specs.right);
    }

    initLeft(specs) {
        this.#guis[0].domElement.style.setProperty('left', '0');
        this.#guis[0].domElement.style.setProperty('top', '70px');
        const eventObjs = [];
        this.addControl(this.#guis[0], specs, eventObjs);
        this.bindChange(this.#guis[0], eventObjs);
    }

    initRight(specs) {
        const eventObjs = [];
        this.addControl(this.#guis[1], specs, eventObjs);
        specs.functions = {};
        Object.defineProperty(specs.functions, 'save', {
            value: () => {
                this.#saveObj = this.#guis[1].save();
                console.log('save successful!');
            },
            writable: true
        });
        Object.defineProperty(specs.functions, 'load', {
            value: () => {
                if (!this.#saveObj) return;
                this.#guis[1].load(this.#saveObj);
                console.log('load succesful!');
            },
            writable: true
        });
        Object.defineProperty(specs.functions, 'reset', {
            value: () => {
                this.#guis[1].reset();
                console.log('reset successful!');
            },
            writable: true
        })
        this.bindFunctions(this.#guis[1], specs.functions);

        this.bindChange(this.#guis[1], eventObjs);
    }

    addControl(gui, specs, eventObjs) {
        specs.details.forEach(detail => {
            const folder = gui.addFolder(detail.folder);
            const target = detail.parent;
            detail.specs.forEach(spec => {
                if (spec.value || spec.changeFn) {
                    Object.defineProperty(spec, 'parent', {
                        value: target,
                        writable: false
                    });
                    eventObjs.push(spec);
                };
                const parent = !spec.value ?
                    spec.sub ? 
                    spec.subprop ? this.#objects[target][spec.sub][spec.subprop] : this.#objects[target][spec.sub] : this.#objects[target] :
                    spec.value;
                const property = spec.name;
                const displayName = spec.prop ?? spec.name;
                switch(spec.type) {
                    case 'boolean':
                        folder.add(parent, property).name(displayName).identifier = target;
                        break;
                    case 'number':
                    case 'light-num':
                        folder.add(parent, property, ...spec.params).name(displayName).identifier = target;
                        break;
                    case 'scene-dropdown':
                        folder.add(parent, property, spec.params).name(displayName).identifier = target;
                        break;
                    case 'color':
                    case 'groundColor':
                        folder.addColor(parent, property, ...spec.params).name(displayName).identifier = target;
                        break;
                    case 'function':
                        this.bindFunctions(folder, parent);
                }
            });
        });
    }

    bindFunctions(parent, functions) {
        const fnames = Object.getOwnPropertyNames(functions);
        fnames.forEach(f => {
            parent.add(functions, f);
        });
    }

    bindChange(gui, eventObjs) {
        gui.onChange(event => {
            const find = eventObjs.find(o => (o.name === event.property || o.prop === event.controller._name) && o.parent === event.controller.identifier);
            if (find) {
                const val = event.value;
                const target = this.#objects[find.parent];
                switch(find.type) {
                    case 'color':
                        target.color.setStyle(this.colorStr(...val));
                        break;
                    case 'groundColor':
                        target.groundColor.setStyle(this.colorStr(...val));
                        break;
                    case 'scene-dropdown':
                        if (this.#sceneChanged) return;
                        this.#sceneChanged = true;
                        find.changeFn(val);
                        break;
                    case 'light-num':
                        find.changeFn();
                        break;
                }
            }
            if (this.#attachedTo.staticRendering) this.#attachedTo.render();
        });
    }

    show() {
        this.#guis.forEach(gui => gui.show());
    }

    hide() {
        this.#guis.forEach(gui => gui.hide());
    }

    reset() {
        this.#guis.forEach(gui => gui.reset());
        this.#sceneChanged = false;
        document.body.removeChild(this.#stats.dom);
    }

    colorStr(r, g, b) {
        return `rgb(${r},${g},${b})`;
    }
}

export { Gui };