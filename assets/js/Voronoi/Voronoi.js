import * as THREE from "three";
import Experience from "./Experience";

import vertexShader from "~/assets/js/Voronoi/shaders/voronoi/vertex.glsl";
import fragmentShader from "~/assets/js/Voronoi/shaders/voronoi/fragment.glsl";

export default class Voronoi {
  constructor() {
    this.experience = new Experience();
    this.scene = new THREE.Scene();
    this.refraction = this.experience.refraction;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.resources.on("ready", () => {
      this.init();
    });
  }

  init() {
    this.addObjects();
    this.setupDebug();
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 300, 300);
    this.geometry.deleteAttribute("normal");

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        // uTexture: new THREE.Uniform(null),
        uTexture: new THREE.Uniform(this.resources.items.landscape),
        uTextureAspect: new THREE.Uniform(new THREE.Vector2(this.resources.items.landscape.image.width, this.resources.items.landscape.image.height)),
        uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width, this.sizes.height)),
        uBorderThickness: new THREE.Uniform(0.01),
        uBorderSoftness: new THREE.Uniform(0.15),
        uGrainSize: new THREE.Uniform(5),
        uHeight: new THREE.Uniform(0.05),
        uSpeed: new THREE.Uniform(0.25),
        uShift: new THREE.Uniform(0.003),
        uIorR: new THREE.Uniform(9),
        uIorG: new THREE.Uniform(9.5),
        uIorB: new THREE.Uniform(9.75),
        uShowNormals: new THREE.Uniform(false),
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      // transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // this.mesh.position.set(0, 0, -0.5);
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
    folder.addBinding(this.material.uniforms.uIorR, "value", { min: 0, max: 20, step: 0.01, label: "Ior Red" });
    folder.addBinding(this.material.uniforms.uIorG, "value", { min: 0, max: 20, step: 0.01, label: "Ior Green" });
    folder.addBinding(this.material.uniforms.uIorB, "value", { min: 0, max: 20, step: 0.01, label: "Ior Blue" });
    folder.addBinding(this.material, "wireframe", { label: "Wireframe" });
    folder.addBinding(this.material.uniforms.uShowNormals, "value", { label: "Normals" });
  }

  update() {
    if (!this.material || !this.refraction) return;

    this.material.uniforms.uTime.value = this.experience.time.elapsed / 1000;

    this.mesh.material.uniforms.uTexture.value = this.refraction.texture.texture;
  }
}
