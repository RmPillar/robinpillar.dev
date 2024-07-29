import * as THREE from "three";

import Debug from "./Utils/Debug";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World";
import Portal from "./Portal";
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

    // Options
    this.canvas = _canvas;

    this.mouse = new THREE.Vector2();

    // Setup
    this.setupEvents();
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();

    this.resources = new Resources(sources);

    this.world = new World();
    this.portal = new Portal();

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

  setupEvents() {
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);

    window.addEventListener("mousemove", this.boundHandleMouseMove);
  }

  handleMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  resize() {
    if (!this.camera || !this.renderer || !this.portal) {
      return;
    }

    this.camera.resize();
    this.renderer.resize();
    this.portal.resize();
  }

  update() {
    if (!this.camera || !this.world || !this.portal || !this.renderer) {
      return;
    }

    this.camera.update();
    this.world.update();
    this.portal.update();
    this.renderer.update();
  }

  destroy() {
    if (!this.camera || !this.renderer || !this.world) {
      return;
    }

    window.removeEventListener("mousemove", this.boundHandleMouseMove);

    this.camera.destroy();
    this.world.destroy();
    this.renderer.destroy();
    this.time.destroy();

    this.instance = null;
    this.scene = null;
  }
}
