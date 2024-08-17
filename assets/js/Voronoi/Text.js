// import {Text2DFacade} from 'troika-2d';
import { MSDFTextGeometry, MSDFTextMaterial } from "three-msdf-text-utils";
import * as THREE from "three";

import Experience from "./Experience";

export default class Text {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.voronoi.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.init();
    });
  }

  init() {
    this.font = this.resources.items.font;
    this.atlas = this.resources.items.atlas;

    this.geometry = new MSDFTextGeometry({
      text: "VORONOI",
      font: this.font.data,
      letterSpacing: 1,
      align: "center",
    });

    this.material = new MSDFTextMaterial();
    this.material.uniforms.uMap.value = this.atlas;
    this.material.uniforms.uColor.value = new THREE.Color(0xf8fafc);
    this.material.side = THREE.DoubleSide;

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.set(-0.045, 0.045, 0.045);
    this.mesh.position.set(-2.4, -0.5, -1);
    this.mesh.rotation.set(Math.PI, Math.PI, -3 * (Math.PI / 180));

    this.scene.add(this.mesh);
  }

  update() {
    if (!this.mesh) {
      return;
    }
  }

  destroy() {
    if (!this.mesh || !this.scene || !this.geometry || !this.material) {
      return;
    }

    this.geometry.dispose();
    this.material.dispose();

    this.scene.remove(this.mesh);
    this.mesh = null;
  }
}
