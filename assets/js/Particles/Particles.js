import * as THREE from "three";
import gsap from "gsap";
import Experience from "./Experience";

import vertexShader from "./shaders/base/vertex.glsl";
import fragmentShader from "./shaders/base/fragment.glsl";

import simulationVertexShader from "./shaders/simulation/vertex.glsl";
import simulationFragmentShader from "./shaders/simulation/fragment.glsl";

const lerp = (a, b, n) => (1 - n) * a + n * b;

export default class Particles {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;

    this.size = 1024;

    this.resources.on("ready", () => {
      console.log("hello");
      this.textures = [this.getPixelDataFromImage(this.resources.items.logo.source), this.getPixelDataFromImage(this.resources.items.super.source)];
      this.initRaycaster();
      this.initFBO();
      this.initParticles();
      this.initAnimations();

      this.initDebug();
    });
  }

  initRaycaster() {
    this.planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial());

    this.dummy = new THREE.Mesh(new THREE.SphereGeometry(0.01, 32, 32), new THREE.MeshNormalMaterial());

    this.scene.add(this.dummy);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.boundHandleMouseMove = this.handleMouseMove.bind(this);

    window.addEventListener("mousemove", this.boundHandleMouseMove);
  }

  initAnimations() {
    gsap.to(this.simulationMaterial.uniforms.uProgress, { value: 0, duration: 2, ease: "power2.inOut" });

    this.timeline = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 5 });
    this.timeline.to(this.simulationMaterial.uniforms.uProgress, { value: 1, duration: 1.5, ease: "power2.inOut" }, 5);
  }

  handleMouseMove() {
    this.pointer.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.pointer.y = -(event.clientY / this.sizes.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera.instance);

    const intersects = this.raycaster.intersectObjects([this.planeMesh]);

    if (intersects.length > 0) {
      // console.log(intersects[0].point.x, intersects[0].point.y)
      this.dummy.position.copy(intersects[0].point);
      this.simulationMaterial.uniforms.uMouse.value.copy(intersects[0].point);
    }
  }

  getPixelDataFromImage({ data: img }) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 200;
    const height = 200;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    const canvasData = ctx.getImageData(0, 0, width, height).data;

    const pixels = [];

    for (let i = 0; i < canvasData.length; i += 4) {
      const x = ((i / 4) % width) / width - 0.5;
      const y = 0.5 - Math.floor(i / 4 / width) / height;

      if (canvasData[i] < 50) {
        pixels.push({ x, y });
      }
    }

    const data = new Float32Array(4 * this.number);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i * this.size + j;
        let randomPixel = pixels[Math.floor(Math.random() * pixels.length)];

        if (Math.random() > 0.9) {
          randomPixel = { x: 3 * (Math.random() - 0.5), y: 3 * (Math.random() - 0.5) };
        }

        data[4 * index] = randomPixel.x + (Math.random() - 0.5) * 0.01;
        data[4 * index + 1] = randomPixel.y + (Math.random() - 0.5) * 0.01;
        data[4 * index + 2] = 0;
        data[4 * index + 3] = 0;
      }
    }

    const dataTexture = new THREE.DataTexture(data, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;

    return dataTexture;
  }

  initParticles() {
    this.addObjects();
  }

  initFBO() {
    this.createDataTexture();

    this.sceneFBO = new THREE.Scene();
    this.cameraFBO = new THREE.OrthographicCamera(-1, 1, 1, -1, -2, 2);

    this.cameraFBO.position.z = 1;
    this.cameraFBO.lookAt(new THREE.Vector3(0, 0, 0));

    const geo = new THREE.PlaneGeometry(2, 2, 2, 2);

    this.simulationMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCurrentPosition: { value: this.textures[0] },
        uOriginalPosition: { value: this.textures[0] },
        uOriginalPositionOne: { value: this.textures[1] },
        uMouse: { value: new THREE.Vector3(-100, -100, 0) },
        uProgress: { value: 0.5 },
        uFriction: { value: 0.96 },
        uBounceBack: { value: 0.003 },
        uMouseForce: { value: 0.05 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });

    this.simulationMesh = new THREE.Mesh(geo, this.simulationMaterial);

    this.sceneFBO.add(this.simulationMesh);

    this.renderTargetOne = new THREE.WebGLRenderTarget(this.size, this.size, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    });

    this.renderTargetTwo = new THREE.WebGLRenderTarget(this.size, this.size, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    });
  }

  createDataTexture() {
    const data = new Float32Array(4 * this.number);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i * this.size + j;
        data[4 * index] = lerp(-0.5, 0.5, j / (this.size - 1));
        data[4 * index + 1] = lerp(-0.5, 0.5, i / (this.size - 1));
        data[4 * index + 2] = 0;
        data[4 * index + 3] = 1;
      }
    }

    this.positions = new THREE.DataTexture(data, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
    this.positions.needsUpdate = true;
  }

  addObjects() {
    this.geometry = new THREE.BufferGeometry(1, 1, 50, 50);
    const positions = new Float32Array(this.number * 3);
    const uvs = new Float32Array(this.number * 2);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = i * this.size + j;

        positions[3 * index] = j / this.size - 0.5;
        positions[3 * index + 1] = i / this.size - 0.5;
        positions[3 * index + 2] = 0;

        uvs[2 * index] = j / (this.size - 1);
        uvs[2 * index + 1] = i / (this.size - 1);
      }
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: null },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      depthWrite: false,
      transparent: true,
      depthTest: false,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  initDebug() {
    if (!this.debug?.ui || !this.debug?.active) {
      return;
    }

    this.simulationFolder = this.debug.ui.addFolder("Simulation");

    this.simulationFolder.add(this.simulationMaterial.uniforms.uFriction, "value").min(0.9).max(1).step(0.001).name("Friction");
    this.simulationFolder.add(this.simulationMaterial.uniforms.uBounceBack, "value").min(0.00001).max(0.01).step(0.00001).name("BounceBack");
    this.simulationFolder.add(this.simulationMaterial.uniforms.uMouseForce, "value").min(0.0001).max(0.01).step(0.0001).name("MouseForce");

    this.simulationFolder.add(this.simulationMaterial.uniforms.uProgress, "value", 0, 1, 0.01).name("progress");

    // this.simulationFolder.open()
  }

  destroy() {
    // this.debug?.ui && this.debug.ui.removeFolder(this.simulationFolder)

    this.scene.remove(this.mesh);
    this.scene.remove(this.dummy);

    this.geometry.dispose();
    this.material.dispose();
    this.simulationMaterial.dispose();
    this.renderTargetOne.dispose();
    this.renderTargetTwo.dispose();

    this.raycaster = null;
    this.mesh = null;
    this.geometry = null;
    this.material = null;
    this.simulationMaterial = null;
    this.renderTargetOne = null;
    this.renderTargetTwo = null;

    window.removeEventListener("mousemove", this.boundHandleMouseMove);
  }

  update() {
    if (!this.material || !this.renderTargetOne || !this.renderTargetTwo || !this.simulationMaterial) {
      return;
    }

    const tmp = this.renderTargetOne;
    this.renderTargetOne = this.renderTargetTwo;
    this.renderTargetTwo = tmp;

    this.simulationMaterial.uniforms.uTime.value = this.experience.time.elapsed;
  }

  get number() {
    return this.size * this.size;
  }
}
