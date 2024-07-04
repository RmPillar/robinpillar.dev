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
    this.geometry = new THREE.PlaneGeometry(1, 1, 300, 300);
    this.geometry.deleteAttribute("normal");

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uTexture: new THREE.Uniform(this.resources.items.landscape),
        uTextureAspect: new THREE.Uniform(new THREE.Vector2(this.resources.items.landscape.image.width, this.resources.items.landscape.image.height)),
        uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width, this.sizes.height)),
        uBorderThickness: new THREE.Uniform(0.01),
        uBorderSoftness: new THREE.Uniform(0.25),
        uGrainSize: new THREE.Uniform(5),
        uHeight: new THREE.Uniform(0.05),
        uSpeed: new THREE.Uniform(0.25),
        uShift: new THREE.Uniform(0.003),
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
    folder.addBinding(this.material.uniforms.uHeight, "value", { min: 0, max: 1, step: 0.01, label: "Height" });
    folder.addBinding(this.material.uniforms.uSpeed, "value", { min: 0, max: 5, step: 0.01, label: "Speed" });
    folder.addBinding(this.material.uniforms.uShift, "value", { min: 0, max: 0.02, step: 0.0001, label: "Shift" });
    folder.addBinding(this.material, "wireframe", { label: "Wireframe" });
  }

  update() {
    if (!this.material) return;

    this.material.uniforms.uTime.value = this.experience.time.elapsed / 1000 + 10;
  }
}
