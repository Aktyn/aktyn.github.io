import * as THREE from 'three'
import { Addons } from './addons'
import { assert } from '../utils/common'

/* eslint-disable @typescript-eslint/no-require-imports */

type TextureName = 'crossParticle' | 'fireParticle' | 'simpleParticle'
type ModelName =
  | 'logo'
  | 'logoEdges'
  | 'titleFullName'
  | 'titleAktyn'
  | 'titleWebsites'
  | 'titleGameDevelopment'
  | 'titleMicrocontrollers'
  | 'titleComputerGraphics'
type ShaderName = 'particleVertex' | 'particleFragment'

export class Assets {
  public static load = async () => {
    assert(Addons.ready, 'Addons are not initialized')
    const gltfLoader = new Addons.GLTFLoader()

    this._textures ??= {
      crossParticle: await loadTexture(require('./textures/particle-cross.png')),
      fireParticle: await loadTexture(require('./textures/particle-fire.png')),
      simpleParticle: await loadTexture(require('./textures/particle-simple.png')),
    } as const

    this._gltfModels ??= {
      logo: await loadGltfModel(gltfLoader, require('./models/logo.glb')),
      logoEdges: await loadGltfModel(gltfLoader, require('./models/logo-edges.glb')),
      titleFullName: await loadGltfModel(gltfLoader, require('./models/titles/full-name.glb')),
      titleAktyn: await loadGltfModel(gltfLoader, require('./models/titles/aktyn.glb')),
      titleWebsites: await loadGltfModel(gltfLoader, require('./models/titles/websites.glb')),
      titleGameDevelopment: await loadGltfModel(
        gltfLoader,
        require('./models/titles/game-development.glb'),
      ),
      titleMicrocontrollers: await loadGltfModel(
        gltfLoader,
        require('./models/titles/microcontrollers.glb'),
      ),
      titleComputerGraphics: await loadGltfModel(
        gltfLoader,
        require('./models/titles/computer-graphics.glb'),
      ),
    }

    this._shaders ??= {
      particleVertex: await loadShader(require('./shaders/particle.vertex')),
      particleFragment: await loadShader(require('./shaders/particle.fragment')),
    }
  }

  public static destroy() {
    this._textures = null
    this._gltfModels = null
  }

  private static _textures: { [key in TextureName]: THREE.Texture } | null = null
  static get textures() {
    assert(!!this._textures, 'Textures not loaded')
    return this._textures
  }

  private static _gltfModels: { [key in ModelName]: THREE.Scene } | null = null
  static get models() {
    assert(!!this._gltfModels, 'Models not loaded')
    return this._gltfModels
  }

  private static _shaders: { [key in ShaderName]: string } | null = null
  static get shaders() {
    assert(!!this._shaders, 'Shaders not loaded')
    return this._shaders
  }
}

function loadTexture(url: string) {
  return new Promise<THREE.Texture>((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        resolve(texture)
      },
      undefined,
      reject,
    )
  })
}

function loadGltfModel(loader: THREE.Loader, url: string) {
  return new Promise<THREE.Scene>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const objectScene = (gltf as { scene: THREE.Scene }).scene
        if (!objectScene.children?.length) {
          reject(new Error('GLTF model has no children'))
          return
        }
        resolve(objectScene)
        console.info(`Loaded ${url}`)
      },
      undefined,
      reject,
    )
  })
}

function loadShader(url: string) {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject(new Error(`Failed to load ${url}: ${xhr.status}`))
        }
      }
    }
    xhr.send(null)
  })
}
