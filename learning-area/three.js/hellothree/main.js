import * as THREE from 'three';

var animating = false;
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 );
camera.position.set(0, 0, 3);
scene.background = new THREE.Color(0xeeeeee);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( container.offsetWidth, container.offsetHeight );
container.appendChild( renderer.domElement );

const light = new THREE.DirectionalLight( 0xffffff, 3.8);
light.position.set(0, 0, 1);
scene.add(light);

const texture = new THREE.TextureLoader().load( './images/molumen_small_funny_angry_monster.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshPhongMaterial({ map: texture });
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cube = new THREE.Mesh( geometry, material );
cube.rotation.x = Math.PI / 5;
cube.rotation.y = Math.PI / 5;
scene.add( cube );

addMouseHandler();
run();

function run() {
    renderer.render( scene, camera );
    if (animating) {
        cube.rotation.y -= 0.01;
    }
	requestAnimationFrame( run );
}

function addMouseHandler() {
    var dom = renderer.domElement;
    dom.addEventListener('mouseup', onMouseUp, false);
}

function onMouseUp(event) {
    event.preventDefault();
    animating = !animating;
}