import { once } from '../utils/common'

const getAddons = once(async () => ({
  LocalWebGL: await import('three/addons/capabilities/WebGL.js').then(
    ({ default: LocalWebGL }) => LocalWebGL,
  ),
  GLTFLoader: await import('three/addons/loaders/GLTFLoader.js').then(
    ({ GLTFLoader }) => GLTFLoader,
  ),
  Stats: await import('three/addons/libs/stats.module.js').then(({ default: Stats }) => Stats),
  RenderPass: await import('three/addons/postprocessing/RenderPass.js').then(
    ({ RenderPass }) => RenderPass,
  ),
  UnrealBloomPass: await import('three/addons/postprocessing/UnrealBloomPass.js').then(
    ({ UnrealBloomPass }) => UnrealBloomPass,
  ),
  OutputPass: await import('three/addons/postprocessing/OutputPass.js').then(
    ({ OutputPass }) => OutputPass,
  ),
  EffectComposer: await import('three/addons/postprocessing/EffectComposer.js').then(
    ({ EffectComposer }) => EffectComposer,
  ),
  MeshSurfaceSampler: await import('three/addons/math/MeshSurfaceSampler.js').then(
    ({ MeshSurfaceSampler }) => MeshSurfaceSampler,
  ),
}))

export type AddonsTypes = Awaited<ReturnType<typeof getAddons>>

const _Addons = {
  initAddons: () =>
    getAddons().then((addons) => {
      Object.assign(_Addons, addons)
      _Addons.ready = true
      Object.seal(_Addons)
    }),
  ready: false,
} as
  | { initAddons: () => Promise<void>; ready: false }
  | (AddonsTypes & { initAddons: () => Promise<void>; ready: true })

export const Addons = _Addons
