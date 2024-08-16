import * as THREE from "three";
import Experience from "./Experience";

export default class Water {
  constructor() {
    this.experience = new Experience();
    this.scene = new THREE.Scene();
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.meshes = [];

    this.mouse = {
      x: 0,
      y: 0,
    };
    this.prevMouse = {
      x: 0,
      y: 0,
    };
    this.currentWave = 0;

    this.waterTexture = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height);

    this.options = {
      scale: 5,
      max: 100,
      fadeRate: 0.95,
      growthRate: 1.02,
      rotationRate: 0.01,
    };

    this.randomRotations = Array.from({ length: this.options.max }, () => (Math.random() > 0.5 ? 1 : -1));
    console.log(this.randomRotations);

    this.resources.on("ready", () => {
      this.initWater();
      this.addListeners();
      this.setupDebug();
    });
  }

  initWater() {
    this.geometry = new THREE.PlaneGeometry(100, 100, 1, 1);

    for (let i = 0; i < this.options.max; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: this.resources.items["water"],
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });

      const mesh = new THREE.Mesh(this.geometry, material);
      mesh.rotation.z = 2 * Math.PI * Math.random();
      mesh.position.x = this.sizes.width * Math.random() - this.sizes.width / 2;
      mesh.position.y = this.sizes.height * Math.random() - this.sizes.height / 2;

      mesh.scale.set(this.options.scale, this.options.scale, 1);
      // mesh.visible = false;

      this.scene.add(mesh);
      this.meshes.push(mesh);
    }
  }

  addListeners() {
    window.addEventListener("mousemove", (event) => {
      this.mouse = {
        x: event.clientX - this.sizes.width / 2,
        y: this.sizes.height / 2 - event.clientY,
      };
    });
  }

  setNewWave(x, y, index) {
    const mesh = this.meshes[index];
    if (!mesh) return;

    mesh.visible = true;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.scale.set(this.options.scale, this.options.scale, 1);

    mesh.material.opacity = 1;
  }

  trackMousePosition() {
    if (Math.abs(this.mouse.x - this.prevMouse.x) > 4 || Math.abs(this.mouse.y - this.prevMouse.y) > 4) {
      this.setNewWave(this.mouse.x, this.mouse.y, this.currentWave);
      this.currentWave = (this.currentWave + 1) % this.options.max;
    }
    this.prevMouse = this.mouse;
  }

  setupDebug() {
    if (!this.debug?.ui) return;

    const folder = this.debug.ui.addFolder("Water");

    folder
      .add(this.options, "max")
      .min(0)
      .max(500)
      .step(1)
      .name("Max Ripples")
      .onChange(() => {
        this.geometry.dispose();
        this.meshes.forEach((mesh) => {
          this.scene.remove(mesh);
        });
        this.meshes = [];
        this.initWater();
      });

    folder
      .add(this.options, "scale")
      .min(0)
      .max(10)
      .step(1)
      .name("Wave Scale")
      .onChange(() => {
        this.meshes.forEach((mesh) => {
          mesh.scale.set(this.options.scale, this.options.scale, 1);
        });
      });

    folder.add(this.options, "fadeRate").min(0.8).max(1).step(0.001).name("Fade Rate");

    folder.add(this.options, "growthRate").min(0.95).max(1.05).step(0.001).name("Growth Rate");
  }

  update() {
    this.trackMousePosition();

    this.meshes.forEach((mesh, index) => {
      if (mesh.visible) {
        // const decayRate = 0.98 + (Math.random() - 0.5) * 0.02;

        const decayRate = this.options.growthRate + (Math.random() - 0.5) * 0.02;

        mesh.rotation.z += this.options.rotationRate * this.randomRotations[index];
        mesh.material.opacity *= this.options.fadeRate;

        mesh.scale.x = decayRate * mesh.scale.x;
        mesh.scale.y = decayRate * mesh.scale.y;

        if (mesh.material.opacity < 0.001) {
          mesh.visible = false;
        }
      }
    });
  }

  resize() {
    this.waterTexture.setSize(this.sizes.width, this.sizes.height);
  }

  destroy() {
    this.scene.remove(this.mesh);

    this.geometry.dispose();
    this.meshes.forEach((mesh) => {
      mesh.material.dispose();
    });

    this.waterTexture.dispose();
  }
}
