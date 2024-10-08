import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};

    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.fontLoader = new FontLoader();
    this.loaders.gltfLoader = new GLTFLoader();
  }

  startLoading() {
    if (!this.loaders?.textureLoader || !this.loaders?.fontLoader) return;
    // Load each source
    for (const source of this.sources) {
      if (source.type === "texture" && typeof source.path === "string") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "font" && typeof source.path === "string") {
        this.loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "gltfModel" && typeof source.path === "string") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
