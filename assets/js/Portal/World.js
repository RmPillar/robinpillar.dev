import * as THREE from "three";
import Experience from "./Experience";
import Camera from "./Camera";

import gsap from "gsap";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.camera = new Camera(false);
    // this.camera = this.experience.camera;
    this.scene = new THREE.Scene();
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.mouse = this.experience.mouse;

    this.cameraOffset = {
      x: 0,
      y: 0,
    };

    this.texture = new THREE.WebGLRenderTarget(this.sizes.width, this.sizes.height);

    this.resources.on("ready", () => {
      // this.init();
      this.initModel();
    });
  }

  init() {
    // this.initModel();
  }

  initModel() {
    // const testLight = new THREE.AmbientLight(0x404040, 10);
    // this.scene.add(testLight);

    const trees = this.resources.items.trees;
    const rocksPlantsPortal = this.resources.items["rocks-plants-portal"];
    const ground = this.resources.items["ground"];
    const redTree = this.resources.items["red-tree"];

    trees.flipY = false;
    // trees.colorSpace = THREE.SRGBColorSpace;
    rocksPlantsPortal.flipY = false;
    // rocksPlantsPortal.colorSpace = THREE.SRGBColorSpace;
    ground.flipY = false;
    // ground.colorSpace = THREE.SRGBColorSpace;
    ground.transparent = true;
    redTree.flipY = false;
    // redTree.colorSpace = THREE.SRGBColorSpace;

    this.materialOne = new THREE.MeshBasicMaterial({ map: trees });
    this.materialTwo = new THREE.MeshBasicMaterial({ map: rocksPlantsPortal });
    this.materialThree = new THREE.MeshBasicMaterial({ map: ground });
    this.materialFour = new THREE.MeshBasicMaterial({ map: redTree });

    this.model = this.resources.items["forest-model"].scene;
    console.log(this.model);
    this.model.traverse((child) => {
      if (child?.name === "trees") {
        child.material = this.materialOne;
      } else if (child?.name === "rocks-plants-portal") {
        child.material = this.materialTwo;
      } else if (child?.name === "ground") {
        child.material = this.materialThree;
      } else if (child?.name === "red-tree") {
        child.material = this.materialFour;
      }
    });

    this.model.scale.set(0.1, 0.1, 0.1);
    this.model.position.set(-7, -0.15, 0);
    this.model.rotation.set(0, Math.PI, 0);

    this.scene.add(this.model);
  }

  addObjects() {
    this.group = new THREE.Group();

    this.cube = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), new THREE.MeshNormalMaterial());
    this.cube.position.x = -0.5;
    this.cube.position.z = -1;

    this.group.add(this.cube);

    this.cone = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.15, 16), new THREE.MeshNormalMaterial());
    this.cone.position.z = -1;

    this.group.add(this.cone);

    this.torus = new THREE.Mesh(new THREE.TorusKnotGeometry(0.1, 0.04, 100, 16), new THREE.MeshNormalMaterial());
    this.torus.position.x = 0.5;
    this.torus.position.z = -1;

    this.group.add(this.torus);

    this.plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }));
    this.plane.position.y = -1;
    this.plane.rotation.x = -Math.PI * 0.5;

    this.group.add(this.plane);

    this.scene.add(this.group);
  }

  setupCameraTweens() {
    this.xTween = gsap.quickTo(this.camera.instance.position, "x", {
      duration: 1,
    });

    this.yTween = gsap.quickTo(this.camera.instance.position, "y", {
      duration: 1,
    });
  }

  update() {
    if (!this.camera) return;

    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    // this.cube.rotation.z += 0.01;

    // this.cone.rotation.x -= 0.01;
    // this.cone.rotation.y += 0.01;
    // this.cone.rotation.z -= 0.01;

    // this.torus.rotation.x += 0.01;
    // this.torus.rotation.y -= 0.01;
    // this.torus.rotation.z += 0.01;

    this.camera.update();

    // this.xTween(this.mouse.x * 0.3);
    // this.yTween(this.mouse.y * 0.15);
    // this.camera.instance.lookAt(this.group.position);
  }

  destroy() {}
}
