import { useLayoutEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useWindowSize } from "~/hooks/useWindowSize"

function generateMatrix3d(
  cameraZ: number,
  fov: number,
  height: number,
  position: THREE.Vector3,
  rotation: THREE.Euler,
  scale: THREE.Vector3,
) {
  const P = height / (2 * Math.tan((fov * Math.PI) / 360))
  const S = P / cameraZ

  const matrix = new THREE.Matrix4()
  matrix.makeRotationFromEuler(rotation)
  matrix.setPosition(position)
  matrix.scale(scale)

  // Apply CSS scale and Y-inversion to map Three.js coordinates to CSS space
  const cssScaleMatrix = new THREE.Matrix4().makeScale(S, -S, S)
  matrix.premultiply(cssScaleMatrix)

  const e = matrix.elements
  return `translate(-50%, -50%) matrix3d(
    ${e[0]}, ${e[1]}, ${e[2]}, ${e[3]},
    ${e[4]}, ${e[5]}, ${e[6]}, ${e[7]},
    ${e[8]}, ${e[9]}, ${e[10]}, ${e[11]},
    ${e[12]}, ${e[13]}, ${e[14]}, ${e[15]}
  )`
}

export function ContentLayer() {
  const { height } = useWindowSize()
  const fov = 70
  const cameraZ = 200
  const perspective = height / (2 * Math.tan((fov * Math.PI) / 360))

  return (
    <div
      className="pointer-events-none h-screen w-full overflow-hidden text-white/20"
      style={{ perspective: `${perspective}px` }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <MatchThreeJSText
          text="Aktyn"
          cameraZ={cameraZ}
          fov={fov}
          height={height}
          calculatePosition={(size) =>
            new THREE.Vector3(size.width / 2, size.height / 2 - 130, 0)
          }
        />
      </div>
    </div>
  )
}

function MatchThreeJSText({
  text,
  cameraZ,
  fov,
  height,
  calculatePosition,
}: {
  text: string
  cameraZ: number
  fov: number
  height: number
  calculatePosition: (size: { width: number; height: number }) => THREE.Vector3
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (ref.current) {
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      })
    }
  }, [text])

  const position = calculatePosition(size)
  // Both objects in Three.js have rotateX(Math.PI) applied
  const rotation = new THREE.Euler(Math.PI, 0, 0)
  const scale = new THREE.Vector3(1, 1, 1)
  const fontSize = 40 //pixels
  const resolutionScalar = 1

  // Use the exact bounds defined in web-scene.ts by projecting the matrix:
  const transform = generateMatrix3d(
    cameraZ,
    fov,
    height,
    position,
    rotation,
    scale,
  )

  return (
    <div
      ref={ref}
      className="pointer-events-auto whitespace-nowrap"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `${transform} scale(${1 / resolutionScalar})`,
        fontSize: `${fontSize * resolutionScalar}px`,
        fontWeight: "bold",
        lineHeight: 1.125, //?
      }}
    >
      {text}
    </div>
  )
}
