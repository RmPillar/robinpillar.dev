import * as THREE from "three";
import Experience from "./Experience";

import toonFragmentShader from "./shaders/toon/fragment.glsl";
import toonVertexShader from "./shaders/toon/vertex.glsl";
import gsap from "gsap";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.isSwitchedOn = false;

    this.mouse = {
      x: 0,
      y: 0,
    };

    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.resources.on("ready", () => {
      this.initLighting();
      this.initMaterials();
      this.initPokedex();
      this.initAnimations();
      this.initEventListeners();
      this.initDebug();
    });
  }

  initLighting() {
    this.ambientLight = new THREE.AmbientLight(0xf8fafc, 0.5);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xf9fafb, 4);
    this.directionalLight.position.set(1, 1, 1);
    // this.directionalLight.castShadow = true;
    // this.directionalLight.shadow.mapSize.width = 4096;
    // this.directionalLight.shadow.mapSize.height = 4096;
    // this.directionalLight.shadow.normalBias = 0.012;
    this.scene.add(this.directionalLight);

    this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 1, 0x0000ff);
    this.scene.add(this.directionalLightHelper);
  }

  initMaterials() {
    this.gameboyMaterial = new THREE.MeshToonMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
    });

    this.screenBorderMaterial = new THREE.MeshToonMaterial({
      color: 0xcbd5e1,
      side: THREE.DoubleSide,
    });

    this.screenMaterial = new THREE.MeshToonMaterial({
      color: 0x27272a,
      side: THREE.DoubleSide,
    });

    this.buttonMaterial = new THREE.MeshToonMaterial({
      color: 0x3f3f46,
      side: THREE.DoubleSide,
    });

    this.buttonsLipMaterial = new THREE.MeshToonMaterial({
      color: 0x52525b,
      side: THREE.DoubleSide,
    });

    this.lightOneMaterial = new THREE.MeshToonMaterial({
      color: 0xfde047,
      side: THREE.DoubleSide,
    });

    this.lightTwoMaterial = new THREE.MeshToonMaterial({
      color: 0x4ade80,
      side: THREE.DoubleSide,
    });

    this.lightThreeMaterial = new THREE.MeshToonMaterial({
      color: 0x60a5fa,
      side: THREE.DoubleSide,
    });

    // this.gameboyMaterial = this.createToonMaterial(0xef4444);

    // this.screenBorderMaterial = this.createToonMaterial(0xf4f4f5);

    // this.buttonMaterial = this.createToonMaterial(0x3f3f46);

    // this.buttonsLipMaterial = this.createToonMaterial(0x52525b);

    // this.lightOneMaterial = this.createToonMaterial(0xfde047);

    // this.lightTwoMaterial = this.createToonMaterial(0x4ade80);

    // this.lightThreeMaterial = this.createToonMaterial(0x60a5fa);
  }

  initPokedex() {
    this.model = this.resources.items.pokedex.scene;

    this.model.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.name.includes("screen-border")) {
        child.material = this.screenBorderMaterial;
      } else if (child.name.includes("screen")) {
        child.material = this.screenMaterial;
      } else if (child.name === "buttons-lip") {
        child.material = this.buttonsLipMaterial;
      } else if (child.name.includes("button") || child.name === "volume-dial" || child.name === "switch" || child.name.includes("antenna")) {
        child.material = this.buttonMaterial;
      } else if (child.name === "light-001") {
        child.material = this.lightOneMaterial;
      } else if (child.name === "light-002") {
        child.material = this.lightTwoMaterial;
      } else if (child.name === "light-003") {
        child.material = this.lightThreeMaterial;
      } else {
        child.material = this.gameboyMaterial;
      }
    });

    this.model.scale.set(0.3, 0.3, 0.3);
    this.model.position.set(0, -0.1, 0);
    this.model.rotation.set(0, -Math.PI / 2, 0);

    this.modelTween = {
      x: gsap.quickTo(this.model.rotation, "x", { duration: 0.2 }),
      y: gsap.quickTo(this.model.rotation, "y", { duration: 0.2 }),
    };

    this.scene.add(this.model);
  }

  initAnimations() {
    this.modelAnimations = this.resources.items.pokedex.animations;
    this.mixer = new THREE.AnimationMixer(this.model);

    this.animations = this.modelAnimations.reduce((acc, animation) => {
      const action = this.mixer?.clipAction(animation);
      action.setLoop(THREE.LoopOnce, 0);
      action.clampWhenFinished = true;

      acc[animation.name] = action;
      return acc;
    }, {});
  }

  initEventListeners() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("keypress", this.handleKeyPress);
  }

  handleMouseMove(e) {
    const x = (e.clientY - this.windowHalfY) / this.windowHalfY;
    const y = (e.clientX - this.windowHalfX) / this.windowHalfX;

    this.mouse = {
      x,
      y,
    };
  }

  handleKeyPress(e) {
    if (e.code === "Space") {
      this.isSwitchedOn = !this.isSwitchedOn;

      this.playAction(this.animations["switch-up"]);

      this.handleSwitchUpFinished = this.handleSwitchUpFinished.bind(this);

      this.mixer.addEventListener("finished", this.handleSwitchUpFinished);
    }
  }

  handleSwitchUpFinished() {
    this.mixer.removeEventListener("finished", this.handleSwitchUpFinished);

    this.playAction(this.animations["antenna-middle-up"]);
    this.playAction(this.animations["antenna-top-up"]);
    this.playAction(this.animations["side-rotate"]);

    this.toggleScreenColor();
  }

  playAction(action) {
    const direction = this.isSwitchedOn ? 1 : -1;

    action.reset();
    action.timeScale = direction;
    action.time = direction === -1 ? action.getClip().duration : 0;

    action.play();
  }

  toggleScreenColor() {
    const screenColor = this.isSwitchedOn ? new THREE.Color(0xfafafa) : new THREE.Color(0x27272a);
    const duration = this.isSwitchOn ? 1.5 : 0.75;

    gsap.to(this.screenMaterial.color, {
      r: screenColor.r,
      g: screenColor.g,
      b: screenColor.b,
      duration,
    });
  }

  createToonMaterial(color, glossiness = 20) {
    return new THREE.ShaderMaterial({
      fragmentShader: toonFragmentShader,
      vertexShader: toonVertexShader,
      lights: true,
      uniforms: {
        ...THREE.UniformsLib.lights,
        uGlossiness: new THREE.Uniform(glossiness),
        uColor: new THREE.Uniform(new THREE.Color(color)),
      },
    });
  }

  initDebug() {
    if (!this.debug?.gui) return;

    this.debug.gui.addBinding(this.directionalLight.shadow, "normalBias", { min: -0.05, max: 0.05, step: 0.001, label: "Shadow Normal Bias" });
    this.debug.gui.addBinding(this.directionalLight.shadow, "bias", { min: -0.05, max: 0.05, step: 0.001, label: "Shadow Bias" });
  }

  update() {
    if (!this.mixer || !this.time?.delta || !this.camera?.instance) return;

    this.mixer?.update(this.time.delta * 0.001);

    // this.modelTween.x(this.mouse.x * Math.PI * -0.1);
    // this.modelTween.y(this.mouse.y * Math.PI * -0.1 - Math.PI / 2);
  }
}
