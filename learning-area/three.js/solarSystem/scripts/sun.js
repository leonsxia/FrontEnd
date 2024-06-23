import * as THREE from 'three';
import { Sim } from './sim/sim';

// Custom Sun class
let Sun = function () {
	Sim.Object.call(this);
}

Sun.prototype = new Sim.Object();

Sun.prototype.init = function () {
	// Create a group to hold our sun mesh and light
	var sunGroup = new THREE.Object3D();

	// Create our sun mesh
	var sunmap = "../images/sun_surface.jpg";
	var texture = new THREE.TextureLoader().load(sunmap);
	texture.colorSpace = THREE.SRGBColorSpace;
	var material = new THREE.MeshLambertMaterial({ map: texture, ambient: 0xffff00 });

	var geometry = new THREE.SphereGeometry(Sun.SIZE_IN_EARTHS, 64, 64);
	var sunMesh = new THREE.Mesh(geometry, material);

	// Create a point light to show off our solar system
	var light = new THREE.PointLight(0xffffff, 5, 10000, 0);

	sunGroup.add(sunMesh);
	sunGroup.add(light);

	// Tell the framework about our object
	this.setObject3D(sunGroup);
}

Sun.SIZE_IN_EARTHS = 10;

export { Sun };