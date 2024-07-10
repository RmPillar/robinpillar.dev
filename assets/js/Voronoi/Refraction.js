import * as THREE from "three";
import Experience from "./Experience";

export default class Refraction {
  constructor() {
    this.experience = new Experience();
    this.voronoi = this.experience.voronoi;
    this.scene = new THREE.Scene();
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.resources.on("ready", () => {
      this.init();
    });
  }

  init() {
    this.texture = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height);
  }

  resize() {
    this.texture.setSize(this.sizes.width, this.sizes.height);
  }

  destroy() {
    if (!this.texture) {
      return;
    }

    this.texture.dispose();

    this.texture = null;
  }
}
