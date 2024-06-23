import { World } from './world/World.js';

// create the main function
function main() {
    const container = document.querySelector('#scene-container');

    // 1. Create an instance of the World app
    const world = new World(container);

    // 2. Render the scene
    world.update();
}

// const renderBtn = document.querySelector('#render');
// renderBtn.addEventListener('click', () => {main()});
main();