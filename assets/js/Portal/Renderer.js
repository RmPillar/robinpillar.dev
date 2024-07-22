import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;

    this.main = {
      scene: this.experience.scene,
      camera: this.experience.camera,
    };

    this.world = {
      texture: this.experience.world.texture,
      scene: this.experience.world.scene,
      camera: this.experience.world.camera,
    };

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
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  resize() {
    if (!this.instance || !this.sizes) {
      return;
    }

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    if (!this.instance || !this.main.scene || !this.main.camera?.instance || !this.world?.texture || !this.world.scene || !this.world.camera?.instance) {
      return;
    }

    this.instance.setClearColor(0xf9fafb, 1);

    this.instance.setRenderTarget(this.world.texture);
    this.instance.render(this.world.scene, this.world.camera.instance);
    this.instance.setRenderTarget(null);
    this.instance.clear();

    this.instance.setClearColor(0xf9fafb, 0);

    this.instance.render(this.main.scene, this.main.camera.instance);
  }

  destroy() {
    if (!this.instance) {
      return;
    }

    this.instance.dispose();

    this.instance = null;
  }
}
