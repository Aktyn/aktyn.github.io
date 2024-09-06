import * as THREE from 'three'
import { calculateTriangulatedGrid, linearValueUpdate, smoothValueUpdate } from '../../helpers'
import { ObjectBase } from '../object-base'

const baseScale = 0.25

type ImageSchema = {
  positionAttribute: THREE.Float32BufferAttribute
  imageScene: THREE.Scene
} & (
  | {
      ready: false
    }
  | {
      ready: true
      source: HTMLImageElement //TODO: use for opening in fullscreen
      aspectRatio: number
    }
)

export class ImagesGallery extends ObjectBase {
  private static readonly imagesCache = new Map<string, THREE.Texture>()

  private readonly images: Array<ImageSchema>
  private totalWidth = 0

  constructor(scene: THREE.Scene, imagesSources: string[]) {
    super(scene)

    this.images = imagesSources.map((source) => {
      const imageScene = new THREE.Scene()

      const gridGeometry = new THREE.BufferGeometry()
      const { vertices, indices, uvs } = calculateTriangulatedGrid(2)
      const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3)
      gridGeometry.setAttribute('position', positionAttribute)
      const uvAttribute = new THREE.Float32BufferAttribute(uvs, 2)
      gridGeometry.setAttribute('uv', uvAttribute)
      gridGeometry.setIndex(indices)
      // this.positionAttribute.needsUpdate = true

      // const lineMaterial = new THREE.LineBasicMaterial({
      //   color: primaryColor,
      //   transparent: true,
      //   opacity: 0.1,
      //   linewidth: 20,
      //   depthTest: true,
      // })

      const schema: ImageSchema = {
        positionAttribute,
        imageScene,
        ready: false,
      }

      const onLoad = (texture: THREE.Texture, first = true) => {
        const img: HTMLImageElement = texture.source.data
        if (first) {
          console.info(`Texture loaded: ${img.src}`)
        }

        texture.colorSpace = THREE.SRGBColorSpace
        Object.assign(schema, {
          ready: true,
          aspectRatio: img.width / img.height,
          source: img,
        })
        Object.seal(schema)

        // texture.removeEventListener('loaded', onLoad)
      }

      const texture =
        ImagesGallery.imagesCache.get(source) ?? new THREE.TextureLoader().load(source, onLoad)
      if (texture.source.data) {
        onLoad(texture, false)
      }

      ImagesGallery.imagesCache.set(source, texture)

      const material = new THREE.MeshBasicMaterial({
        // color: 0x353535,
        depthTest: true,
        map: texture,
      })
      // const wireframe = new THREE.Line(gridGeometry, lineMaterial)
      const mesh = new THREE.Mesh(gridGeometry, material)
      // mesh.layers.set(LAYER.NO_BLOOM)

      // imageScene.add(mesh, wireframe)
      imageScene.add(mesh)
      imageScene.scale.setScalar(baseScale)
      imageScene.position.z = 0.75
      // imageScene.position.x = index * 0.525

      scene.add(imageScene)

      return schema
    })
  }

  destroy() {
    for (const image of this.images) {
      this.scene.remove(image.imageScene)
    }
  }

  public resize(width: number, height: number) {
    super.resize(width, height)
    // this.object.scale.setScalar(Math.min(1, width / height) * 0.618)
  }

  public update(delta: number) {
    let offsetX = 0
    for (const image of this.images) {
      if (!image.ready) {
        continue
      }

      if (image.imageScene.scale.x !== image.aspectRatio) {
        image.imageScene.scale.x = linearValueUpdate(
          image.imageScene.scale.x,
          image.aspectRatio * baseScale,
          delta * 0.25,
        )
        image.imageScene.position.x = smoothValueUpdate(
          image.imageScene.position.x,
          (offsetX + image.aspectRatio - this.totalWidth / 2) * baseScale,
          delta * 2,
        )
        offsetX += image.aspectRatio * 2
      }
    }
    this.totalWidth = offsetX
  }
}
