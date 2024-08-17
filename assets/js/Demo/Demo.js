// Dependencies
import * as THREE from "three";

// Classes
import Experience from "./Experience";

// Shaders
import vertexShader from "./shaders/refraction/vertex.glsl";
import fragmentShader from "./shaders/refraction/fragment.glsl";

export default class Demo {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.refraction = this.experience.refraction;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;

    this.objects = [];

    this.resources.on("ready", () => {
      this.init();
    });
  }

  init() {
    this.refractionMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: new THREE.Uniform(null),
        // Refraction Uniforms
        uSamples: new THREE.Uniform(16),
        uIorR: new THREE.Uniform(1.1),
        uIorY: new THREE.Uniform(1.13),
        uIorG: new THREE.Uniform(1.18),
        uIorC: new THREE.Uniform(1.3),
        uIorB: new THREE.Uniform(1.12),
        uIorP: new THREE.Uniform(1.17),
        uRefractPower: new THREE.Uniform(0.11),
        uChromaticAberration: new THREE.Uniform(0.25),
        uSaturation: new THREE.Uniform(1.1),
        // Light Uniforms
        uLight: new THREE.Uniform(new THREE.Vector3(1.0, 1.0, -1.0)),
        uDiffuseness: new THREE.Uniform(0.05),
        uShininess: new THREE.Uniform(3),
        uFresnelPower: new THREE.Uniform(20),
        // Other Uniforms
        uTime: new THREE.Uniform(0),
        uResolution: new THREE.Uniform(new THREE.Vector2(this.sizes.width, this.sizes.height).multiplyScalar(this.sizes.pixelRatio)),
      },
      vertexShader,
      fragmentShader,
    });

    this.createCube([0, 1, 0.5], [0.2, 0.2, 0.2], -0.0025);
    this.createCube([-0.2, 0.8, 0.1], [0.15, 0.15, 0.15], -0.0015);
    this.createCone([0.6, 0.9, -0.1], 0.1, 0.2, 16, -0.00375);
    this.createCone([-0.6, 0.95, 0], 0.1, 0.2, 16, -0.00275);
    this.createSuzanne([0.3, 1.1, 0.2], 0.1, -0.002);
    this.createCube([-0.3, 1.2, 0.4], [0.1, 0.1, 0.1], -0.00125);
    this.createCube([-0.6, 1.15, 0.6], [0.125, 0.125, 0.125], -0.0015);
    this.createCone([1, 0.95, -0.1], 0.15, 0.3, 16, -0.00225);
  }

  createCube(startPosition, size, speed) {
    const geometry = new THREE.BoxGeometry(...size);

    const mesh = new THREE.Mesh(geometry, this.refractionMaterial);

    mesh.position.set(...startPosition);

    this.scene.add(mesh);

    const rotation = new THREE.Vector3((Math.random() - 0.5) * 0.025, (Math.random() - 0.5) * 0.025, (Math.random() - 0.5) * 0.025);

    this.objects.push({
      geometry,
      material: this.refractionMaterial,
      mesh,
      speed,
      rotation,
    });
  }

  createSuzanne(startPosition, size, speed) {
    const model = this.resources.items.suzanne.scene;

    model.traverse((child) => {
      if (child.isMesh) child.material = this.refractionMaterial;
    });

    model.position.set(...startPosition);
    model.scale.set(size, size, size);

    const rotation = new THREE.Vector3((Math.random() - 0.5) * 0.025, (Math.random() - 0.5) * 0.025, (Math.random() - 0.5) * 0.025);

    this.scene.add(model);

    this.objects.push({
      material: this.refractionMaterial,
      mesh: model,
      speed,
      rotation,
    });
  }

  createCone(startPosition, radius, height, detail, speed) {
    const geometry = new THREE.ConeGeometry(radius, height, detail);

    const mesh = new THREE.Mesh(geometry, this.refractionMaterial);

    mesh.position.set(...startPosition);

    const rotation = new THREE.Vector3((Math.random() - 0.5) * 0.025, (Math.random() - 0.5) * 0.025, (Math.random() - 0.5) * 0.025);

    this.scene.add(mesh);

    this.objects.push({
      geometry,
      material: this.refractionMaterial,
      mesh,
      speed,
      rotation,
    });
  }

  toggleMeshes(visible = false) {
    this.objects.forEach(({ mesh }) => {
      mesh.visible = visible;
    });
  }

  update() {
    if (!this.refractionMaterial || !this.refraction) return;

    this.objects.forEach(({ mesh, speed, rotation }) => {
      mesh.rotation.y += rotation.y;
      mesh.rotation.x += rotation.x;
      mesh.rotation.z += rotation.z;

      mesh.position.y += speed;

      if (mesh.position.y < -1) {
        mesh.position.y = 1;
      }
    });

    this.refractionMaterial.uniforms.uTexture.value = this.refraction.texture.texture;
  }

  resize() {
    if (!this.refractionMaterial || !this.sizes) return;

    console.log("resize", this.sizes.width, this.sizes.height);

    const newSize = new THREE.Vector2(this.sizes.width, this.sizes.height).multiplyScalar(this.sizes.pixelRatio);

    this.refractionMaterial.uniforms.uResolution.value.x = newSize.x;
    this.refractionMaterial.uniforms.uResolution.value.y = newSize.y;
  }

  destroy() {}
}
