import * as THREE from "three";
import Experience from "./Experience";

export default class Screen {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera; // Assume this.camera contains an object with the camera in 'instance'
    this.pokedex = this.experience.pokedex;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.initScreen();
    });
  }

  initScreen() {
    this.model = this.pokedex.model;
    this.screenEl = document.querySelector(".screen"); // HTML element
    this.screen = this.scene.getObjectByName("screen"); // 3D object in the scene

    this.updateHtmlPosition();
  }

  update() {
    if (!this.screen || !this.screenEl) return;
    // this.updateHtmlPosition();
  }

  // Function to update HTML position and size
  updateHtmlPosition() {
    const camera = this.camera.instance; // Access the camera instance

    // 1. Calculate position in screen space
    const [xPos, yPos] = this.defaultCalculatePosition(this.screen, camera, this.sizes);

    // 2. Calculate scale based on camera distance
    const scale = this.objectScale(this.screen, camera);

    // 3. Apply CSS transform to match the 3D object's position and scale
    const matrix = this.getObjectCSSMatrix(this.screen.matrixWorld, scale);
    this.screenEl.style.transform = `translate(${xPos}px, ${yPos}px) ${matrix}`;

    // 4. Set the width/height based on the bounding box projected to screen space
    this.updateHtmlSize();
  }

  updateHtmlSize() {
    const camera = this.camera.instance;
    const boundingBox = new THREE.Box3().setFromObject(this.screen);

    // Get the 8 corner vertices of the bounding box
    const corners = [
      new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
      new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),
      new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),
      new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z),
      new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z),
      new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),
      new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),
      new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z),
    ];

    // Project all corner points into screen space
    const projectedCorners = corners.map((corner) => {
      const projected = corner.clone().project(camera);
      return {
        x: (projected.x * 0.5 + 0.5) * this.sizes.width,
        y: (-(projected.y * 0.5) + 0.5) * this.sizes.height,
      };
    });

    // Get the min/max screen-space positions
    const minX = Math.min(...projectedCorners.map((corner) => corner.x));
    const maxX = Math.max(...projectedCorners.map((corner) => corner.x));
    const minY = Math.min(...projectedCorners.map((corner) => corner.y));
    const maxY = Math.max(...projectedCorners.map((corner) => corner.y));

    // Set the width and height based on the screen space size
    const width = maxX - minX;
    const height = maxY - minY;

    this.screenEl.style.width = `${width}px`;
    this.screenEl.style.height = `${height}px`;
  }

  // Function to calculate the screen position of the object
  defaultCalculatePosition(el, camera, size) {
    const objectPos = new THREE.Vector3().setFromMatrixPosition(el.matrixWorld);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    return [objectPos.x * widthHalf + widthHalf, -(objectPos.y * heightHalf) + heightHalf];
  }

  // Function to calculate the object scale based on camera type and distance
  objectScale(el, camera) {
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    if (camera instanceof THREE.OrthographicCamera) {
      return camera.zoom;
    } else if (camera instanceof THREE.PerspectiveCamera) {
      const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
      const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
      const vFOV = (camera.fov * Math.PI) / 180;
      const dist = objectPos.distanceTo(cameraPos);
      const scaleFOV = 2 * Math.tan(vFOV / 2) * dist;
      return 1 / scaleFOV;
    } else {
      return 1;
    }
  }

  // Function to convert object's world matrix to a CSS matrix
  getObjectCSSMatrix(matrix, factor) {
    return this.getCSSMatrix(matrix, this.scaleMultipliers(factor), "translate(-50%,-50%)");
  }

  // Utility to generate a CSS 3D matrix
  getCSSMatrix(matrix, multipliers, prepend = "") {
    let matrix3d = "matrix3d(";
    for (let i = 0; i !== 16; i++) {
      matrix3d += this.epsilon(multipliers[i] * matrix.elements[i]) + (i !== 15 ? "," : ")");
    }
    return prepend + matrix3d;
  }

  // Helper to handle small numbers
  epsilon(value) {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }

  // Scale multipliers for converting the object's transformation to CSS-friendly format
  scaleMultipliers(factor) {
    return [1 / factor, 1 / factor, 1 / factor, 1, -1 / factor, -1 / factor, -1 / factor, -1, 1 / factor, 1 / factor, 1 / factor, 1, 1, 1, 1, 1];
  }
}
