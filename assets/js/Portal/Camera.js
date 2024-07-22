import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Experience from "./Experience";

export default class Camera {
  constructor(controls = true) {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.renderer = this.experience.renderer;

    this.setInstance();

    if (controls) {
      this.setControls();
    }
  }

  setInstance() {
    if (!this.scene || !this.sizes) {
      return;
    }

    this.instance = new THREE.PerspectiveCamera(70, this.sizes.width / this.sizes.height, 0.01, 10);
    this.instance.position.set(0, 0, 1);
    this.scene.add(this.instance);
  }

  setControls() {
    if (!this.instance || !this.canvas) {
      return;
    }

    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    if (!this.sizes || !this.instance) {
      return;
    }

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (!this.controls) {
      return;
    }
    this.controls.update();
  }

  destroy() {
    this.scene.remove(this.instance);

    this.instance = null;
  }
}
