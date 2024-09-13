import { easeInOutCubic } from 'js-easing-functions'
import * as THREE from 'three'
import { clamp, mix } from '../../../utils/math'
import { calculateTriangulatedGrid, linearValueUpdate } from '../../helpers'
import { ObjectBase } from '../object-base'

export type ImageSourceType = string | { source: string; color: number }

type ImageSchema = {
  positionAttribute: THREE.Float32BufferAttribute
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
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
  private static readonly targetScale = 0.25
  private static readonly targetRadius = 2.5
  private static readonly gap = 0.1
  private static readonly minOpacity = 0.5

  private readonly images: Array<ImageSchema>
  private readonly imagesScene: THREE.Scene
  private enterAnimationScaleFactor = 0
  private imagesWidthsSum = 0
  private galleryRotation = 0

  constructor(scene: THREE.Scene, imagesSources: Array<ImageSourceType>) {
    super(scene)

    this.imagesScene = new THREE.Scene()
    scene.add(this.imagesScene)

    this.images = imagesSources.map((sourceData) => {
      const source = typeof sourceData === 'string' ? sourceData : sourceData.source
      const color = typeof sourceData === 'string' ? 0xffffff : sourceData.color

      const gridGeometry = new THREE.BufferGeometry()
      const { vertices, indices, uvs } = calculateTriangulatedGrid(2)
      const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3)
      gridGeometry.setAttribute('position', positionAttribute)
      const uvAttribute = new THREE.Float32BufferAttribute(uvs, 2)
      gridGeometry.setAttribute('uv', uvAttribute)
      gridGeometry.setIndex(indices)

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
      }

      const texture =
        ImagesGallery.imagesCache.get(source) ?? new THREE.TextureLoader().load(source, onLoad)

      ImagesGallery.imagesCache.set(source, texture)

      const material = new THREE.MeshBasicMaterial({
        depthTest: true,
        map: texture,
        transparent: true,
        opacity: ImagesGallery.minOpacity,
        side: THREE.DoubleSide,
        color,
      })
      const mesh = new THREE.Mesh(gridGeometry, material)

      const schema: ImageSchema = {
        positionAttribute,
        mesh,
        ready: false,
        material,
      }

      if (texture.source.data) {
        onLoad(texture, false)
      }

      this.imagesScene.add(mesh)

      return schema
    })
  }

  destroy() {
    this.scene.remove(this.imagesScene)
  }

  // public resize(width: number, height: number) {
  //   super.resize(width, height)
  // }

  public update(delta: number) {
    this.galleryRotation += delta * 0.1

    if (this.enterAnimationScaleFactor < 1) {
      this.enterAnimationScaleFactor = linearValueUpdate(
        this.enterAnimationScaleFactor,
        1,
        delta * 0.5,
      )
    }

    const scaleFactor = easeInOutCubic(this.enterAnimationScaleFactor, 0, 1, 1)
    this.imagesScene.scale.setScalar(ImagesGallery.targetScale * scaleFactor)

    const circumference = this.imagesWidthsSum
    const radius = circumference / (2 * Math.PI)

    const offsetZ = (ImagesGallery.targetRadius - radius) / 2
    this.imagesScene.position.z = linearValueUpdate(
      this.imagesScene.position.z,
      offsetZ,
      delta * 0.5,
    )

    let offsetX = 0
    for (const image of this.images) {
      if (!image.ready) {
        continue
      }

      if (image.mesh.scale.x !== image.aspectRatio) {
        image.mesh.scale.x = linearValueUpdate(image.mesh.scale.x, image.aspectRatio, delta * 0.25)
      }

      const imageOffset = offsetX + image.aspectRatio - this.imagesWidthsSum / 2

      const angleOffset = (imageOffset / circumference) * 2 * Math.PI + this.galleryRotation
      image.mesh.rotation.y = -angleOffset + Math.PI / 2

      const x = Math.cos(angleOffset) * radius
      const z = Math.sin(angleOffset) * radius
      image.mesh.position.x = x
      image.mesh.position.z = z

      image.material.opacity = mix(
        ImagesGallery.minOpacity,
        1,
        clamp(Math.PI / 2 - angleDifference(angleOffset, Math.PI / 2), 0, 1),
      )

      offsetX += image.aspectRatio * 2 + ImagesGallery.gap
    }
    this.imagesWidthsSum = offsetX
  }
}

function angleDifference(angle1: number, angle2: number) {
  const diff = Math.abs(angle1 - angle2)

  return Math.min(diff, Math.PI * 2 - diff)
}
