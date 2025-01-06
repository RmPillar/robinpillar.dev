import * as THREE from "three";
import Experience from "./Experience";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
    // this.setCSSInstance();
    this.setEffect();
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
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  setCSSInstance() {
    if (!this.sizes) {
      return;
    }

    this.cssInstance = new CSS3DRenderer({
      element: this.cssEl,
    });
    this.cssInstance.setSize(this.sizes.width, this.sizes.height);

    // this.cssInstance.domElement.classList.add("inset-0");
    // this.cssInstance.domElement.classList.add("fixed");
  }

  setEffect() {
    this.outlineEffect = new OutlineEffect(this.instance);
  }

  resize() {
    if (!this.instance || !this.sizes) {
      return;
    }

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

    // this.cssInstance.setSize(this.sizes.width, this.sizes.height);
    // this.cssInstance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    if (!this.outlineEffect || !this.scene || !this.camera?.instance) {
      return;
    }

    this.outlineEffect.render(this.scene, this.camera.instance);
  }

  destroy() {
    if (!this.instance) {
      return;
    }

    this.instance.dispose();
    // this.cssInstance.dispose();

    this.instance = null;
    // this.cssInstance = null;
  }
}
