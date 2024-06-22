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

    // this.resources.on('ready', () => {
    this.initWorld();
    // })
  }

  initWorld() {
    this.addObjects();
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(this.sizes.width, this.sizes.height);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
      },
      vertexShader,
      fragmentShader,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {
    if (!this.material) return;

    this.material.uniforms.uTime.value = this.experience.time.elapsed / 1000 + 10;
  }
}
