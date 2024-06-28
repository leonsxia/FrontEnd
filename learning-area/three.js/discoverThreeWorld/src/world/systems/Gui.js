import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

class Gui {
    #gui;
    #objects = [];
    #attachedTo;
    #guiLoaded = false;
    #saveObj = null;

    constructor () {
        this.#gui = new GUI();
    }

    init(specs) {
        this.#objects = specs.parents;
        this.#attachedTo = specs.attachedTo;
        if (this.#guiLoaded) return;
        this.#guiLoaded = true;
        const eventObjs = [];
        specs.details.forEach(detail => {
            const folder = this.#gui.addFolder(detail.folder);
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
                    case 'color':
                        folder.addColor(parent, property, ...spec.params);
                        break;
                }
            });
        });
        specs.functions = {};
        Object.defineProperty(specs.functions, 'save', {
            value: () => {
                this.#saveObj = this.#gui.save();
                console.log('save successful!');
            },
            writable: true
        });
        Object.defineProperty(specs.functions, 'load', {
            value: () => {
                if (!this.#gui) return;
                this.#gui.load(this.#saveObj);
                console.log('load succesful!');
            },
            writable: true
        });
        this.#gui.add(specs.functions, 'save');
        this.#gui.add(specs.functions, 'load');
        this.#gui.onChange(event => {
            const find = eventObjs.find(o => o.value.hasOwnProperty(event.property));
            if (find) {
                const val = event.value;
                const target = this.#objects.find(o => o.name === find.parent).value;
                switch(find.type) {
                    case 'color':
                        const color = `rgb(${val[0]},${val[1]},${val[2]})`;
                        target.color.setStyle(color);
                        break;
                }
            }
            if (this.#attachedTo.staticRendering) this.#attachedTo.render();
        });
    }

    show() {
        this.#gui.show();
    }

    hide() {
        this.#gui.hide();
    }

    reset() {
        this.#gui.reset();
    }
}

export { Gui };