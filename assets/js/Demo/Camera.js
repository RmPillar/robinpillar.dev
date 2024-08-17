import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Experience from "./Experience";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;

    this.scene = this.experience.scene;

    this.canvas = this.experience.canvas;
    this.renderer = this.experience.renderer;

    // this.setOrthographicCamera();
    this.setPerspectiveCamera();
  }

  setOrthographicCamera() {
    if (!this.scene || !this.sizes) return;

    this.instance = new THREE.OrthographicCamera(this.sizes.width / -2, this.sizes.width / 2, this.sizes.height / 2, this.sizes.height / -2, 1, 1000);
    this.instance.position.set(0, 0, 1);
    this.scene.add(this.instance);
  }

  setPerspectiveCamera() {
    if (!this.scene || !this.sizes) return;

    this.instance = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.01, 10);
    this.instance.position.set(0, 0, 1);
    this.scene.add(this.instance);

    this.setControls();
  }

  setControls() {
    if (!this.instance || !this.canvas) return;

    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = 110 * (Math.PI / 180);
    this.controls.minPolarAngle = 70 * (Math.PI / 180);
    this.controls.maxAzimuthAngle = 20 * (Math.PI / 180);
    this.controls.minAzimuthAngle = -20 * (Math.PI / 180);
  }

  resizeOrthographicCamera() {
    if (!this.sizes || !this.instance) return;

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.left = -this.sizes.width / 2;
    this.instance.right = this.sizes.width / 2;
    this.instance.top = this.sizes.height / 2;
    this.instance.bottom = -this.sizes.height / 2;
    this.instance.updateProjectionMatrix();
  }

  resizePerspectiveCamera() {
    if (!this.sizes || !this.instance) return;

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  resize() {
    // this.resizeOrthographicCamera();
    this.resizePerspectiveCamera();
  }

  update() {
    if (!this.controls) return;

    this.controls.update();
  }

  destroy() {
    this.scene.remove(this.instance);

    this.instance = null;
  }
}
