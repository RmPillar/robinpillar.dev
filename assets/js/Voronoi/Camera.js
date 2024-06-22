import * as THREE from "three";
import Experience from "./Experience";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.renderer = this.experience.renderer;

    this.setInstance();
  }

  setInstance() {
    if (!this.scene || !this.sizes) return;

    this.instance = new THREE.OrthographicCamera(this.sizes.width / -2, this.sizes.width / 2, this.sizes.height / 2, this.sizes.height / -2, 1, 1000);
    this.instance.position.set(0, 0, 1);
    this.scene.add(this.instance);
  }

  resize() {
    if (!this.sizes || !this.instance) return;

    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.left = -this.sizes.width / 2;
    this.instance.right = this.sizes.width / 2;
    this.instance.top = this.sizes.height / 2;
    this.instance.bottom = -this.sizes.height / 2;
    this.instance.updateProjectionMatrix();
  }

  update() {}

  destroy() {
    this.scene.remove(this.instance);

    this.instance = null;
  }
}
