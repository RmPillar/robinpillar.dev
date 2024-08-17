import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;

    this.voronoi = this.experience.voronoi;
    this.voronoiScene = this.voronoi.scene;

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
    if (!this.instance || !this.voronoiScene || !this.camera?.instance || !this.refractionScene || !this.refraction.texture || !this.voronoi?.mesh) {
      return;
    }

    this.voronoi.mesh.visible = false;

    this.instance.setRenderTarget(this.refraction.texture);
    this.instance.render(this.voronoiScene, this.camera.instance);
    this.instance.setRenderTarget(null);
    this.instance.clear();

    this.voronoi.mesh.visible = true;

    this.instance.render(this.voronoiScene, this.camera.instance);
  }

  destroy() {
    if (!this.instance) {
      return;
    }

    this.instance.dispose();

    this.instance = null;
  }
}
