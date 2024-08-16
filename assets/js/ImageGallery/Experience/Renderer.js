import * as THREE from 'three'
import Experience from './Experience'

export default class Renderer {
  constructor () {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.waterEffect = this.experience.waterEffect
    this.waterScene = this.waterEffect.scene
    this.havenScene = this.experience.haven.scene
    this.camera = this.experience.camera

    this.setInstance()
  }

  setInstance () {
    if (!this.canvas || !this.sizes) { return }

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    this.instance.gammaInput = true
    this.instance.gammaOutput = true
  }

  resize () {
    if (!this.instance || !this.sizes) { return }

    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update () {
    if (
      !this.instance ||
      !this.havenScene ||
      !this.waterScene ||
      !this.waterEffect?.waterTexture ||
      !this.camera?.instance
    ) { return }

    this.instance.setRenderTarget(this.waterEffect.waterTexture)
    this.instance.render(this.waterScene, this.camera.instance)
    this.instance.setRenderTarget(null)
    this.instance.clear()

    this.instance.render(this.havenScene, this.camera.instance)
    // this.instance.render(this.waterScene, this.camera.instance);
  }
}
