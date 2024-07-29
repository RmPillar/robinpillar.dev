// import {Text2DFacade} from 'troika-2d';
import { MSDFTextGeometry, MSDFTextMaterial } from "three-msdf-text-utils";
import * as THREE from "three";

import Experience from "./Experience";

export default class Text {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;

    this.resources.on("ready", () => {
      this.init();
    });
  }

  init() {
    this.font = this.resources.items.font;
    this.atlas = this.resources.items.atlas;

    this.geometry = new MSDFTextGeometry({
      text: "ROBIN PILLAR",
      font: this.font.data,
      align: "center",
    });

    this.material = new MSDFTextMaterial();
    this.material.uniforms.uMap.value = this.atlas;
    this.material.uniforms.uColor.value = new THREE.Color(0x18181b);
    this.material.side = THREE.DoubleSide;

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.resize();
    this.mesh.rotation.set(Math.PI, Math.PI, 0);

    this.scene.add(this.mesh);
  }

  resize() {
    const boundingBox = this.mesh.geometry.computeBoundingBox();
    const width = boundingBox.max.x - boundingBox.min.x;
    const height = boundingBox.max.y - boundingBox.min.y;
    const scale = (this.sizes.width - 120) / width;
    const position = new THREE.Vector2(-this.sizes.width / 2 + 60, (height * scale) / 2 - 60);

    this.mesh.scale.set(-scale, scale, scale);
    this.mesh.position.set(position.x, -position.y, 0);
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
