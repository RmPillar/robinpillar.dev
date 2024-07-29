import * as THREE from "three";

import Debug from "./Utils/Debug";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Text from "./Text";
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
    this.renderer = new Renderer();
    this.resources = new Resources(sources);
    this.text = new Text();

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
    if (!this.camera || !this.renderer || !this.text) {
      return;
    }

    this.camera.resize();
    this.renderer.resize();
    this.text.resize();
  }

  update() {
    if (!this.camera || !this.text || !this.renderer) {
      return;
    }

    this.camera.update();
    this.text.update();
    this.renderer.update();
  }

  destroy() {
    if (!this.camera || !this.renderer) {
      return;
    }

    this.camera.destroy();
    this.renderer.destroy();
    this.time.destroy();

    this.instance = null;
    this.scene = null;
  }
}
