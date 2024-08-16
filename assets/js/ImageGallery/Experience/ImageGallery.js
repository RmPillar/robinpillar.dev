import * as THREE from "three";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";

import Experience from "./Experience";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export default class Haven {
  constructor() {
    gsap.registerPlugin(CustomEase);
    this.experience = new Experience();
    this.scene = new THREE.Scene();
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.activeIndex = 0;
    this.nextIndex = 1;
    this.nextNextIndex = 2;

    this.transitionSpeed = {
      in: 0.75,
      out: 1,
    };
    this.windowSize = 0.2;

    this.resources.on("ready", () => {
      this.initImages();
      this.setupDebug();
    });
  }

  initImages() {
    CustomEase.create("bounceOut", ".51,-0.37,.25,1");
    CustomEase.create("bounceIn", ".42,0,.03,1.36");

    this.imageKeys = Object.keys(this.resources.items).filter((key) => key.includes("landscape"));
    this.createMesh();

    gsap
      .to(this.material.uniforms.uProgress, {
        value: this.windowSize,
        duration: this.transitionSpeed.in,
        ease: "bounceIn",
      })
      .then(() => {
        this.experience.headings[this.activeIndex].classList.add("active");
      });
  }

  getUniforms() {
    return {
      uTexture1: {
        value: this.resources.items[this.imageKeys[this.activeIndex]],
      },
      uTexture2: {
        value: this.resources.items[this.imageKeys[this.nextIndex]],
      },
      uTextureAspect1: {
        value: new THREE.Vector2(this.resources.items[this.imageKeys[this.activeIndex]].image.width, this.resources.items[this.imageKeys[this.activeIndex]].image.height),
      },
      uTextureAspect2: {
        value: new THREE.Vector2(this.resources.items[this.imageKeys[this.nextIndex]].image.width, this.resources.items[this.imageKeys[this.nextIndex]].image.height),
      },
      uBorderThickness: { value: 0.0025 },
      uDisplacement: {
        value: null,
      },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uProgress: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(this.sizes.width, this.sizes.height),
      },
      uParallax: { value: 0.005 },
      uTime: { value: 0 },
    };
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    const uniforms = this.getUniforms();

    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      defines: {
        PR: window.devicePixelRatio.toFixed(1),
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
    this.mesh.scale.set(this.sizes.width, this.sizes.height, 1);

    this.scene.add(this.mesh);
  }

  changeImage() {
    if (!this.material || !this?.experience?.headings) {
      return;
    }

    this.experience.headings[this.activeIndex].classList.remove("active");

    const activeIndex = this.nextIndex;
    const nextIndex = activeIndex + 1 > this.imageKeys.length - 1 ? 0 : activeIndex + 1;

    const timeline = gsap.timeline();
    timeline
      .to(
        this.material.uniforms.uProgress,
        {
          value: 1.2,
          duration: this.transitionSpeed.out,
          ease: "bounceOut",
        },
        0,
      )
      .call(() => {
        this.material.uniforms.uTexture1.value = this.resources.items[this.imageKeys[activeIndex]];
        this.material.uniforms.uTextureAspect1.value = new THREE.Vector2(this.resources.items[this.imageKeys[activeIndex]].image.width, this.resources.items[this.imageKeys[activeIndex]].image.height);

        this.material.uniforms.uTexture2.value = this.resources.items[this.imageKeys[nextIndex]];
        this.material.uniforms.uTextureAspect2.value = new THREE.Vector2(this.resources.items[this.imageKeys[nextIndex]].image.width, this.resources.items[this.imageKeys[nextIndex]].image.height);

        this.material.uniforms.uProgress.value = 0;

        this.activeIndex = activeIndex;
        this.nextIndex = nextIndex;
      })
      .to(this.material.uniforms.uProgress, {
        value: this.windowSize,
        duration: this.transitionSpeed.in,
        ease: "bounceIn",
      })
      .call(
        () => {
          this.experience.headings[this.activeIndex].classList.add("active");
        },
        null,
        "<+=0.1",
      );
  }

  createRipple(e) {
    const x = e.clientX / this.sizes.width;
    const y = e.clientY / this.sizes.height;

    this.material.uniforms.uMouse.value = new THREE.Vector2(-x + 0.5, y - 0.5);
  }

  setupDebug() {
    if (!this.debug?.ui) {
      return;
    }

    const folder = this.debug.ui.addFolder("Haven");

    folder.add(this.material.uniforms.uParallax, "value").step(0.0001).min(0).max(0.05).name("Parallax");

    folder.add(this.material.uniforms.uBorderThickness, "value").step(0.0005).min(0).max(0.025).name("Border Thickness");

    folder.add(this.transitionSpeed, "in").step(0.01).min(0).max(2).name("Transition Speed In");

    folder.add(this.transitionSpeed, "out").step(0.01).min(0).max(2).name("Transition Speed Out");

    folder.open();
  }

  update() {
    if (!this.experience?.waterEffect?.waterTexture?.texture || !this.material?.uniforms) {
      return;
    }

    this.material.uniforms.uDisplacement.value = this.experience.waterEffect.waterTexture.texture;
  }

  resize() {
    this.material.uniforms.uResolution.value.x = this.sizes.width;
    this.material.uniforms.uResolution.value.y = this.sizes.height;

    this.material.uniforms.uTextureAspect1.value = new THREE.Vector2(this.resources.items[this.imageKeys[this.activeIndex]].image.width, this.resources.items[this.imageKeys[this.activeIndex]].image.height);

    this.material.uniforms.uTextureAspect2.value = new THREE.Vector2(this.resources.items[this.imageKeys[this.nextIndex]].image.width, this.resources.items[this.imageKeys[this.nextIndex]].image.height);

    this.mesh.scale.x = this.sizes.width;
    this.mesh.scale.y = this.sizes.height;
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
