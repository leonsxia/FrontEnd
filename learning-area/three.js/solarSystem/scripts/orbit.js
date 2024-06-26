import * as THREE from 'three';
import { Sim } from './sim/sim';

// Custom Orbit class
let Orbit = function () {
	Sim.Object.call(this);
}

Orbit.prototype = new Sim.Object();

Orbit.prototype.init = function (distance) {
	// Create an empty geometry object to hold the line vertex data
	var geometry = new THREE.BufferGeometry();

	// Create points along the circumference of a circle with radius == distance
	var i, len = 60, twopi = 2 * Math.PI;
	const points = [];
	for (i = 0; i <= Orbit.N_SEGMENTS; i++) {
		var x = distance * Math.cos(i / Orbit.N_SEGMENTS * twopi);
		var z = distance * Math.sin(i / Orbit.N_SEGMENTS * twopi);
		var vertex = new THREE.Vector3(x, 0, z);
		points.push(vertex);
	}

	geometry.setFromPoints(points);

	let material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: .5, linewidth: 2 });

	// Create the line
	var line = new THREE.Line(geometry, material);

	// Tell the framework about our object
	this.setObject3D(line);
}

Orbit.N_SEGMENTS = 120;

export { Orbit };