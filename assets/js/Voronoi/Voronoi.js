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

    this.detail = {
      value: 650,
    };

    this.resources.on("ready", () => {
      this.init();
    });
  }

  init() {
    this.addObjects();
    this.setupDebug();
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(1, 1, this.detail.value, this.detail.value);
    // Remove normals attribute as we'll end up calculating them in the shader
    this.geometry.deleteAttribute("normal");

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        // Voronoi Uniforms
        uTexture: new THREE.Uniform(null),
        uBorderThickness: new THREE.Uniform(0.01),
        uBorderSoftness: new THREE.Uniform(0.25),
        uGrainSize: new THREE.Uniform(5),
        uHeight: new THREE.Uniform(0.05),
        uSpeed: new THREE.Uniform(0.25),
        uShift: new THREE.Uniform(0.003),
        // Refraction Uniforms
        uSamples: new THREE.Uniform(16),
        uIorR: new THREE.Uniform(2.2),
        uIorY: new THREE.Uniform(2.23),
        uIorG: new THREE.Uniform(2.18),
        uIorC: new THREE.Uniform(2.3),
        uIorB: new THREE.Uniform(2.12),
        uIorP: new THREE.Uniform(2.27),
        uRefractPower: new THREE.Uniform(0.3),
        uChromaticAberration: new THREE.Uniform(1.0),
        uSaturation: new THREE.Uniform(1.1),
        // Light Uniforms
        uLight: new THREE.Uniform(new THREE.Vector3(1.0, 1.0, -1.0)),
        uDiffuseness: new THREE.Uniform(0.1),
        uShininess: new THREE.Uniform(1.25),
        uFresnelPower: new THREE.Uniform(14),
        // Other Uniforms
        uTime: new THREE.Uniform(0),
        uShowNormals: new THREE.Uniform(false),
        uShowSpecular: new THREE.Uniform(false),
        uShowDisplacement: new THREE.Uniform(false),
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

    const voronoiFolder = this.debug.gui.addFolder({
      title: "Voronoi",
    });

    const refractionFolder = this.debug.gui.addFolder({
      title: "Refraction",
    });

    const lightFolder = this.debug.gui.addFolder({
      title: "Light",
    });

    const otherFolder = this.debug.gui.addFolder({
      title: "Other",
    });

    voronoiFolder.addBinding(this.material.uniforms.uBorderThickness, "value", { min: 0, max: 1, step: 0.01, label: "Border Thickness" });
    voronoiFolder.addBinding(this.material.uniforms.uBorderSoftness, "value", { min: 0, max: 1, step: 0.01, label: "Border Softness" });
    voronoiFolder.addBinding(this.material.uniforms.uGrainSize, "value", { min: 1, max: 12, step: 1, label: "Grain Size" });
    voronoiFolder.addBinding(this.material.uniforms.uHeight, "value", { min: 0, max: 1, step: 0.01, label: "Height" });
    voronoiFolder.addBinding(this.material.uniforms.uSpeed, "value", { min: 0, max: 5, step: 0.01, label: "Speed" });
    voronoiFolder.addBinding(this.material.uniforms.uShift, "value", { min: 0, max: 0.02, step: 0.0001, label: "Shift" });

    refractionFolder.addBinding(this.material.uniforms.uSamples, "value", { min: 1, max: 32, step: 1, label: "Loops" });
    refractionFolder.addBinding(this.material.uniforms.uIorR, "value", { min: 0, max: 20, step: 0.01, label: "Ior Red" });
    refractionFolder.addBinding(this.material.uniforms.uIorY, "value", { min: 0, max: 20, step: 0.01, label: "Ior Yellow" });
    refractionFolder.addBinding(this.material.uniforms.uIorG, "value", { min: 0, max: 20, step: 0.01, label: "Ior Green" });
    refractionFolder.addBinding(this.material.uniforms.uIorC, "value", { min: 0, max: 20, step: 0.01, label: "Ior Cyan" });
    refractionFolder.addBinding(this.material.uniforms.uIorB, "value", { min: 0, max: 20, step: 0.01, label: "Ior Blue" });
    refractionFolder.addBinding(this.material.uniforms.uIorP, "value", { min: 0, max: 20, step: 0.01, label: "Ior Purple" });
    refractionFolder.addBinding(this.material.uniforms.uRefractPower, "value", { min: 0, max: 1, step: 0.01, label: "Refract Power" });
    refractionFolder.addBinding(this.material.uniforms.uChromaticAberration, "value", { min: 0, max: 2, step: 0.01, label: "Chromatic Aberration" });
    refractionFolder.addBinding(this.material.uniforms.uSaturation, "value", { min: 1, max: 1.25, step: 0.01, label: "Saturation" });

    lightFolder.addBinding(this.material.uniforms.uLight.value, "x", { label: "Light X" });
    lightFolder.addBinding(this.material.uniforms.uLight.value, "y", { label: "Light Y" });
    lightFolder.addBinding(this.material.uniforms.uLight.value, "z", { label: "Light Z" });
    lightFolder.addBinding(this.material.uniforms.uDiffuseness, "value", { min: 0, max: 1, step: 0.01, label: "Diffuseness" });
    lightFolder.addBinding(this.material.uniforms.uShininess, "value", { min: 0, max: 5, step: 0.01, label: "Shininess" });
    lightFolder.addBinding(this.material.uniforms.uFresnelPower, "value", { min: 0, max: 100, step: 0.1, label: "Fresnel Power" });

    otherFolder.addBinding(this.material, "wireframe", { label: "Wireframe" });
    otherFolder.addBinding(this.material.uniforms.uShowNormals, "value", { label: "Normals" });
    otherFolder.addBinding(this.material.uniforms.uShowSpecular, "value", { label: "Specular" });
    otherFolder.addBinding(this.material.uniforms.uShowDisplacement, "value", { label: "Displacement" });
  }

  update() {
    if (!this.material || !this.refraction) return;

    this.material.uniforms.uTime.value = this.experience.time.elapsed / 1000;

    this.mesh.material.uniforms.uTexture.value = this.refraction.texture.texture;
  }

  destroy() {
    if (!this.material || !this.geometry || !this.mesh) return;

    this.material.dispose();
    this.geometry.dispose();
    this.scene.remove(this.mesh);

    this.material = null;
    this.geometry = null;
    this.mesh = null;
  }
}
