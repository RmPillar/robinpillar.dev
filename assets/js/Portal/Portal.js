import * as THREE from "three";
import Experience from "./Experience";

import vertexShader from "~/assets/js/Portal/shaders/portal/vertex.glsl";
import fragmentShader from "~/assets/js/Portal/shaders/portal/fragment.glsl";

export default class Portal {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.world = this.experience.world;
    this.debug = this.experience.debug;

    this.resources.on("ready", () => {
      this.init();
    });
  }

  init() {
    this.initModel();
    // this.initLights();
    this.initPortal();
    // this.initDebug();
  }

  initModel() {
    // const testLight = new THREE.AmbientLight(0x404040, 10);
    // this.scene.add(testLight);

    const plantsPortalColumnsTorches = this.resources.items["plants-portal-columns-torches"];
    const wallsRocksPaving = this.resources.items["walls-rocks-paving"];

    plantsPortalColumnsTorches.flipY = false;
    plantsPortalColumnsTorches.colorSpace = THREE.SRGBColorSpace;
    wallsRocksPaving.flipY = false;
    wallsRocksPaving.colorSpace = THREE.SRGBColorSpace;

    this.materialOne = new THREE.MeshBasicMaterial({ map: plantsPortalColumnsTorches });
    this.materialTwo = new THREE.MeshBasicMaterial({ map: wallsRocksPaving });

    this.model = this.resources.items.model.scene;
    this.model.traverse((child) => {
      if (child?.name === "plants-portals-columns-torches") {
        child.material = this.materialOne;
      } else if (child?.name === "walls-rocks-pavings") {
        child.material = this.materialTwo;
      }
    });

    this.model.scale.set(0.1, 0.1, 0.1);
    this.model.position.set(0, -0.5, 0);

    this.scene.add(this.model);
  }

  initLights() {
    this.spotLight = new THREE.SpotLight(0xffffff, 20);

    this.spotLight.position.set(0, 2, 3);
    this.spotLight.lookAt(0, 0, 0);

    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;

    this.spotLight.shadow.camera.near = 5;
    this.spotLight.shadow.camera.far = 100;
    this.spotLight.shadow.camera.fov = 3000;

    this.scene.add(this.spotLight);
  }

  initPortal() {
    this.geometry = new THREE.PlaneGeometry(1.1, 1.1, 200, 200);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        // Portal Uniforms
        uTexture: new THREE.Uniform(null),
        uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width, this.sizes.height)),
        uMouse: new THREE.Uniform(this.experience.mouse),
        uTime: new THREE.Uniform(0),
        uSpeed: new THREE.Uniform(0.001),
        uFrequency: new THREE.Uniform(50),
        uAmplitude: new THREE.Uniform(0.015),
        uShift: new THREE.Uniform(0.008),
        uIor: new THREE.Uniform(1.1),
        uRefractPower: new THREE.Uniform(0.12),
        // Light Uniforms
        uLight: new THREE.Uniform(new THREE.Vector3(2.0, 2.0, -4.0)),
        uDiffuseness: new THREE.Uniform(0.02),
        uShininess: new THREE.Uniform(3.75),
        uFresnelPower: new THREE.Uniform(7),
      },
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.set(0.05, -0.1, -1.0);

    this.scene.add(this.mesh);
  }

  initDebug() {
    const portalFolder = this.debug.gui.addFolder({
      title: "Portal",
    });

    const lightFolder = this.debug.gui.addFolder({
      title: "Light",
    });

    const positionFolder = this.debug.gui.addFolder({
      title: "Position",
    });

    portalFolder.addBinding(this.material.uniforms.uSpeed, "value", { min: 0, max: 0.005, step: 0.0001, label: "Speed" });
    portalFolder.addBinding(this.material.uniforms.uFrequency, "value", { min: 0, max: 100, step: 1, label: "Frequency" });
    portalFolder.addBinding(this.material.uniforms.uAmplitude, "value", { min: 0, max: 0.1, step: 0.001, label: "Amplitude" });
    portalFolder.addBinding(this.material.uniforms.uShift, "value", { min: 0, max: 0.02, step: 0.0001, label: "Shift" });
    portalFolder.addBinding(this.material.uniforms.uIor, "value", { min: 1, max: 2, step: 0.01, label: "Ior" });
    portalFolder.addBinding(this.material.uniforms.uRefractPower, "value", { min: 0, max: 1, step: 0.01, label: "Refract Power" });

    lightFolder.addBinding(this.material.uniforms.uLight.value, "x", { label: "Light X" });
    lightFolder.addBinding(this.material.uniforms.uLight.value, "y", { label: "Light Y" });
    lightFolder.addBinding(this.material.uniforms.uLight.value, "z", { label: "Light Z" });
    lightFolder.addBinding(this.material.uniforms.uDiffuseness, "value", { min: 0, max: 1, step: 0.01, label: "Diffuseness" });
    lightFolder.addBinding(this.material.uniforms.uShininess, "value", { min: 0, max: 5, step: 0.01, label: "Shininess" });
    lightFolder.addBinding(this.material.uniforms.uFresnelPower, "value", { min: 0, max: 100, step: 0.1, label: "Fresnel Power" });

    positionFolder.addBinding(this.mesh, "position");
  }

  resize() {
    this.material.uniforms.uResolution.value.set(this.sizes.width, this.sizes.height);
  }

  update() {
    if (!this.material || !this.experience.time || !this.world?.texture) {
      return;
    }

    this.material.uniforms.uTime.value = this.experience.time.elapsed;
    this.material.uniforms.uTexture.value = this.world.texture.texture;
  }

  destroy() {}
}
