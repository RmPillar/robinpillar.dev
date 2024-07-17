import Debug from "./Utils/Debug";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Voronoi from "./Voronoi";
import Refraction from "./Refraction";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Text from "./Text";

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
    this.resources = new Resources(sources);
    this.refraction = new Refraction();
    this.voronoi = new Voronoi();
    this.text = new Text();

    this.camera = new Camera();
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
    if (!this.camera || !this.renderer || !this.voronoi) {
      return;
    }

    this.camera.resize();
    this.renderer.resize();
    this.voronoi.resize();
  }

  update() {
    if (!this.camera || !this.voronoi || !this.text || !this.renderer) {
      return;
    }

    this.camera.update();
    this.voronoi.update();
    this.text.update();
    this.renderer.update();
  }

  destroy() {
    if (!this.camera || !this.renderer || !this.time || !this.voronoi || !this.text || !this.debug) {
      return;
    }

    this.camera.destroy();
    this.renderer.destroy();
    this.time.destroy();
    this.voronoi.destroy();
    this.text.destroy();

    this.debug.destroy();

    this.instance = null;
    this.scene = null;
  }
}
