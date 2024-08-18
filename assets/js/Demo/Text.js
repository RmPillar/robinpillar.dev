// Dependencies
import * as THREE from "three";
import { MSDFTextGeometry, MSDFTextMaterial } from "three-msdf-text-utils";

// Classes
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
    this.initText();
  }

  initText() {
    this.font = this.resources.items.font;
    this.atlas = this.resources.items.atlas;

    this.material = new MSDFTextMaterial();
    this.material.uniforms.uMap.value = this.atlas;
    this.material.uniforms.uColor.value = new THREE.Color(0xffafafa);
    this.material.side = THREE.DoubleSide;

    this.heading = this.createHeading();
    this.subheading = this.createSubHeading();
  }

  createHeading() {
    const geometry = new MSDFTextGeometry({
      text: "ROBIN PILLAR",
      font: this.font.data,
      letterSpacing: 1,
      width: this.headingWidth,
      lineHeight: this.headingLineHeight,
    });

    const mesh = new THREE.Mesh(geometry, this.material);

    const scale = this.headingScale;
    const position = this.headingPosition;

    mesh.scale.set(-scale, scale, scale);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(Math.PI, Math.PI, 0);

    this.scene.add(mesh);

    return {
      geometry,
      mesh,
    };
  }

  createSubHeading() {
    const geometry = new MSDFTextGeometry({
      text: "CREATIVE DEVELOPER",
      font: this.font.data,
      letterSpacing: 1,
      align: "center",
    });

    const mesh = new THREE.Mesh(geometry, this.material);

    const scale = this.subheadingScale;
    const position = this.subheadingPosition;

    mesh.scale.set(-scale, scale, scale);
    mesh.position.set(position.x, position.y, position.z);

    mesh.rotation.set(Math.PI, Math.PI, 0);

    this.scene.add(mesh);

    return {
      geometry,
      mesh,
    };
  }

  get headingScale() {
    return this.sizes.width > 1024 ? this.clamp(this.sizes.width * (0.025 / 1920), 0.1333, 0.025) : this.sizes.width > 1024 ? 0.0175 : 0.0125;
  }

  get subheadingScale() {
    return this.sizes.width > 1024 ? this.clamp(this.sizes.width * (0.00625 / 1920), 0.00333, 0.00625) : this.sizes.width > 1024 ? 0.004375 : 0.003125;
  }

  get headingPosition() {
    return this.sizes.width > 1024 ? new THREE.Vector3(this.clamp(this.sizes.width * (-2.15 / 1920), -2.15, -1.147), -0.2, -1) : this.sizes.width > 1024 ? new THREE.Vector3(-1.5, -0.2, -1) : new THREE.Vector3(-0.525, -0.25, -1);
  }

  get subheadingPosition() {
    return this.sizes.width > 1024 ? new THREE.Vector3(this.clamp(this.sizes.width * (-2.15 / 1920), -2.15, -1.147), this.clamp(this.sizes.width * (-0.5 / 1920), -0.5, -0.4), -1) : this.sizes.width > 1024 ? new THREE.Vector3(-1.5, -0.4, -1) : new THREE.Vector3(-0.525, -0.45, -1);
  }

  get headingWidth() {
    return this.sizes.width <= 1024 ? 100 : null;
  }

  get headingLineHeight() {
    return this.sizes.width <= 1024 ? this.font.data.common.lineHeight * 0.8 : this.font.data.common.lineHeight;
  }

  // interpolate(val, scalar) {
  //   return val * scalar
  // }

  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  update() {}

  resize() {
    if (!this.sizes || !this.heading?.mesh || !this.subheading?.mesh) return;

    const headingScale = this.headingScale;
    const headingPosition = this.headingPosition;

    const subheadingScale = this.subheadingScale;
    const subheadingPosition = this.subheadingPosition;

    this.heading.mesh.scale.set(-headingScale, headingScale, headingScale);
    this.heading.mesh.position.set(headingPosition.x, headingPosition.y, headingPosition.z);

    console.log(headingPosition, headingScale, this.sizes.width);

    this.subheading.mesh.scale.set(-subheadingScale, subheadingScale, subheadingScale);
    this.subheading.mesh.position.set(subheadingPosition.x, subheadingPosition.y, subheadingPosition.z);

    this.heading.geometry.update({
      width: this.headingWidth,
      lineHeight: this.headingLineHeight,
    });
  }

  destroy() {
    if (!this.mesh || !this.scene || !this.heading || !this.subheading || !this.material) {
      return;
    }

    this.heading?.geometry.dispose();
    this.subheading?.geometry.dispose();
    this.material.dispose();

    this.scene.remove(this.heading.mesh);
    this.heading.mesh = null;
    this.scene.remove(this.subheading.mesh);
    this.subheading.mesh = null;
  }
}
