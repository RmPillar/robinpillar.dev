import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.sceneFBO = this.experience.particles.sceneFBO;
      this.cameraFBO = this.experience.particles.cameraFBO;
      this.renderTargetOneFBO = this.experience.particles.renderTargetOne;
      this.renderTargetTwoFBO = this.experience.particles.renderTargetTwo;
      this.material = this.experience.particles.material;
      this.simulationMaterial = this.experience.particles.simulationMaterial;
    });

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
    });
    this.instance.setClearColor(0x222222);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  resize() {
    if (!this.instance || !this.sizes) {
      return;
    }

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    if (!this.instance || !this.scene || !this.camera?.instance || !this.sceneFBO || !this.cameraFBO || !this.renderTargetOneFBO || !this.renderTargetTwoFBO || !this.material || !this.simulationMaterial) {
      return;
    }

    this.renderTargetOneFBO = this.experience.particles.renderTargetOne;
    this.renderTargetTwoFBO = this.experience.particles.renderTargetTwo;

    this.instance.setRenderTarget(this.renderTargetOneFBO);
    this.instance.render(this.sceneFBO, this.cameraFBO);

    this.instance.setRenderTarget(null);
    this.instance.render(this.scene, this.camera.instance);

    const tmp = this.renderTargetOneFBO;
    this.renderTargetOneFBO = this.renderTargetTwoFBO;
    this.renderTargetTwoFBO = tmp;

    this.material.uniforms.uTexture.value = this.renderTargetOneFBO.texture;
    this.simulationMaterial.uniforms.uCurrentPosition.value = this.renderTargetTwoFBO.texture;
  }

  destroy() {
    if (!this.instance) {
      return;
    }

    this.instance.dispose();

    this.instance = null;

    this.renderTargetOneFBO = null;
    this.renderTargetTwoFBO = null;
  }
}
