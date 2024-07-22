import * as THREE from 'three'
import Experience from './Experience'

export default class Renderer {
  constructor () {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
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
  }

  resize () {
    if (!this.instance || !this.sizes) { return }

    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update () {
    if (!this.instance || !this.scene || !this.camera?.instance) { return }

    this.instance.render(this.scene, this.camera.instance)
  }

  destroy () {
    if (!this.instance) { return }

    this.instance.dispose()

    this.instance = null
  }
}
