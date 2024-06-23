import { WorldScene1 } from "./world/WorldScene1";
import { WorldScene2 } from "./world/WorldScene2";
import { WorldScene3 } from "./world/WorldScene3";

const container = document.querySelector('#scene-container');
const header = document.querySelector('#sceneTitle');
const select = document.querySelector('select[name="selWorld"]');
const msg = document.querySelector('#msg');
const leftPanel = document.querySelector('#leftPanel');
const rightPanel = document.querySelector('#rightPanel');
// const renderBtn = document.querySelector('#render');
const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');
const moveCamera = document.querySelector("#moveCamera");
const resetCamera = document.querySelector("#resetCamera");
const focusNext = document.querySelector('#focusNext');
let world;

// create the main function
async function main() {
    // console.log(select);
    bindBtn();
    await loadWorld(select.value);
}

function loadWorld(sel) {
    switch(sel) {
        case 'world0':
            resetContainer(1);
            world = new WorldScene1(container, [leftPanel, rightPanel]);
            initWorld(world);
            break;
        case 'world1':
            resetContainer(2);
            world = new WorldScene2(container, [leftPanel, rightPanel]);
            initWorld(world);
            break;
        case 'world2':
            resetContainer(3);
            world = new WorldScene3(container, [leftPanel, rightPanel]);
            initWorld(world);
    }
}

function resetContainer(num) {
    if (world) world.dispose();
    header.textContent = `DiscoverThreeJs - World Scene${num}`;
    container.innerHTML = '';
    msg.textContent = 'loading assets...';
}

async function initWorld(world) {
    await world.init();
    msg.textContent = 'assets all loaded.'
    world.render();
}

function bindBtn() {
    // renderBtn.addEventListener('click', () => {main()});
    startBtn.addEventListener('click', () => world.start(focusNext));
    stopBtn.addEventListener('click', () => world.stop());
    moveCamera.addEventListener('click', () => world.moveCamera());
    resetCamera.addEventListener('click', () => world.resetCamera());
    focusNext.addEventListener('click', () => world.focusNext());
    select.addEventListener('change', (event) => loadWorld(event.target.value));
}

main().catch((err) => {
    console.log(err);
});