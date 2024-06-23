// import { EarthApp } from './earth-basic';
// import { EarthApp } from './earth-lit';
// import { EarthApp } from './earth-shader';
import { EarthApp } from "./earth-moon";
// import { SolarSystemApp } from "./solarSystem2";

const container = document.getElementById('container');
var app = new EarthApp();
// var app = new SolarSystemApp();
app.init({ container: container });
app.run();