import Debug from "./Utils/Debug";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Haven from "./ImageGallery";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Water from "./Water";

let instance = null;

export default class Experience {
  constructor(_canvas, _headings) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = _canvas;
    this.headings = _headings;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.resources = new Resources(sources);
    this.waterEffect = new Water();
    this.haven = new Haven();

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

  changeImage() {
    this.haven.changeImage();
  }

  createRipple(e) {
    this.haven.createRipple(e);
  }

  resize() {
    if (!this.camera || !this.renderer || !this.haven) {
      return;
    }

    this.camera.resize();
    this.renderer.resize();
    this.haven.resize();
  }

  update() {
    if (!this.camera || !this.haven || !this.waterEffect || !this.renderer) {
      return;
    }

    this.camera.update();
    this.haven.update();
    this.waterEffect.update();
    this.renderer.update();
  }

  destroy() {
    if (!this.camera || !this.renderer || !this.haven || !this.waterEffect) {
      return;
    }

    this.camera.instance.remove();
    this.renderer.instance.dispose();

    this.haven.destroy();
    this.waterEffect.destroy();

    instance = null;
  }
}
