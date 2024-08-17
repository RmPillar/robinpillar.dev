import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;

    this.scene = this.experience.scene;

    this.demo = this.experience.demo;

    this.refraction = this.experience.refraction;
    this.refractionScene = this.refraction.scene;

    this.setInstance();
  }

  setInstance() {
    if (!this.canvas || !this.sizes) {
      return;
    }

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      // clearColor: 0x000000,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    if (!this.instance || !this.sizes) {
      return;
    }

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    if (!this.instance || !this.scene || !this.camera?.instance || !this.refractionScene || !this.refraction.texture || this.demo?.objects.length === 0) {
      return;
    }

    this.demo.toggleMeshes(false);

    this.instance.setRenderTarget(this.refraction.texture);
    this.instance.render(this.scene, this.camera.instance);
    this.instance.setRenderTarget(null);
    this.instance.clear();

    this.demo.toggleMeshes(true);

    this.instance.render(this.scene, this.camera.instance);
  }

  destroy() {
    if (!this.instance) {
      return;
    }

    this.instance.dispose();

    this.instance = null;
  }
}
