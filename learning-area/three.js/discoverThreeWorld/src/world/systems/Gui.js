import { GUI } from 'lil-gui';
import Stats from 'stats.js';

class Gui {
    #guis = [];
    #stats = null;
    #objects = [];
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
        this.#objects = specs.left.parents.concat(specs.right.parents);
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
                if (spec.value) {
                    Object.defineProperty(spec, 'parent', {
                        value: target,
                        writable: false
                    });
                    eventObjs.push(spec);
                };
                const parent = !spec.value ? this.#objects.find(o => o.name === target).value : spec.value;
                const property = spec.name;
                switch(spec.type) {
                    case 'number':
                        folder.add(parent, property, ...spec.params);
                        break;
                    case 'scene-dropdown':
                        folder.add(parent, property, spec.params);
                        break;
                    case 'color':
                        folder.addColor(parent, property, ...spec.params);
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
            const find = eventObjs.find(o => o.value.hasOwnProperty(event.property));
            if (find) {
                const val = event.value;
                const target = this.#objects.find(o => o.name === find.parent).value;
                switch(find.type) {
                    case 'color':
                        const color = `rgb(${val[0]},${val[1]},${val[2]})`;
                        target.color.setStyle(color);
                        break;
                    case 'scene-dropdown':
                        if (this.#sceneChanged) return;
                        this.#sceneChanged = true;
                        target(val);
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
}

export { Gui };