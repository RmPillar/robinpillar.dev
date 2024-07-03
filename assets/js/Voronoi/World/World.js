import * as THREE from "three";
import Experience from "../Experience";

import vertexShader from "~/assets/js/Voronoi/shaders/voronoi/vertex.glsl";
import fragmentShader from "~/assets/js/Voronoi/shaders/voronoi/fragment.glsl";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.resources.on("ready", () => {
      this.initWorld();
    });
  }

  initWorld() {
    this.addObjects();
    this.setupDebug();
  }

  addObjects() {
    // this.geometry = new THREE.PlaneGeometry(this.sizes.width, this.sizes.height);
    this.geometry = new THREE.PlaneGeometry(1, 1, 200, 200);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uTextureOne: new THREE.Uniform(this.resources.items.landscape),
        uTextureAspect: new THREE.Uniform(new THREE.Vector2(this.resources.items.landscape.image.width, this.resources.items.landscape.image.height)),
        uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width, this.sizes.height)),
        uBorderThickness: new THREE.Uniform(0.05),
        uBorderSoftness: new THREE.Uniform(0.0),
        uGrainSize: new THREE.Uniform(5),
        uZMultiplier: new THREE.Uniform(0.6),
        uMaxZ: new THREE.Uniform(0.06),
        uSpeed: new THREE.Uniform(0.25),
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setupDebug() {
    if (!this.debug?.gui) return;

    const folder = this.debug.gui.addFolder({
      title: "Voronoi",
    });

    folder.addBinding(this.material.uniforms.uBorderThickness, "value", { min: 0, max: 1, step: 0.01, label: "Border Thickness" });
    folder.addBinding(this.material.uniforms.uBorderSoftness, "value", { min: 0, max: 1, step: 0.01, label: "Border Softness" });
    folder.addBinding(this.material.uniforms.uGrainSize, "value", { min: 1, max: 50, step: 1, label: "Grain Size" });
    folder.addBinding(this.material.uniforms.uZMultiplier, "value", { min: 0, max: 1, step: 0.01, label: "Z Multiplier" });
    folder.addBinding(this.material.uniforms.uMaxZ, "value", { min: 0, max: 0.1, step: 0.001, label: "Max Z" });
    folder.addBinding(this.material.uniforms.uSpeed, "value", { min: 0, max: 5, step: 0.01, label: "Speed" });
    folder.addBinding(this.material, "wireframe", { label: "Wireframe" });
  }

  update() {
    if (!this.material) return;

    this.material.uniforms.uTime.value = this.experience.time.elapsed / 1000 + 10;
  }
}
