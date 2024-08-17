import * as THREE from "three";

import Debug from "./Utils/Debug";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Particles from "./Particles";
import Resources from "./Utils/Resources";
import sources from "./sources";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = _canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.resources = new Resources(sources);
    this.particles = new Particles();
    this.renderer = new Renderer();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    if (!this.camera || !this.renderer) {
      return;
    }

    this.camera.resize();
    this.renderer.resize();
  }

  destroy() {
    this.camera && this.camera.destroy();
    this.renderer && this.renderer.destroy();
    this.particles && this.particles.destroy();
  }

  update() {
    if (!this.camera || !this.particles || !this.renderer) {
      return;
    }

    this.camera.update();
    this.particles.update();
    this.renderer.update();
  }
}
