import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { svgPathToShapePath } from "./graphics-helpers"
import * as THREE from "three"

describe("svgPathToShapePath", () => {
  let moveToSpy: ReturnType<typeof vi.spyOn>
  let lineToSpy: ReturnType<typeof vi.spyOn>
  let bezierCurveToSpy: ReturnType<typeof vi.spyOn>
  let quadraticCurveToSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    moveToSpy = vi.spyOn(THREE.ShapePath.prototype, "moveTo")
    lineToSpy = vi.spyOn(THREE.ShapePath.prototype, "lineTo")
    bezierCurveToSpy = vi.spyOn(THREE.ShapePath.prototype, "bezierCurveTo")
    quadraticCurveToSpy = vi.spyOn(
      THREE.ShapePath.prototype,
      "quadraticCurveTo",
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("parses the example absolute SVG path correctly", () => {
    const pathStr = "M 10 20 L 30 40 L 50 60"
    svgPathToShapePath(pathStr)

    expect(moveToSpy).toHaveBeenCalledWith(10, 20)
    expect(lineToSpy).toHaveBeenCalledWith(30, 40)
    expect(lineToSpy).toHaveBeenCalledWith(50, 60)
  })

  it("handles relative path commands", () => {
    const pathStr = "m 10 10 l 5 5"
    svgPathToShapePath(pathStr)
    expect(moveToSpy).toHaveBeenCalledWith(10, 10)
    expect(lineToSpy).toHaveBeenCalledWith(15, 15) // 10+5, 10+5
  })

  it("handles consecutive coordinates for M and m as L and l", () => {
    const pathStr = "M 10 10 20 20 m 5 5 10 10"
    svgPathToShapePath(pathStr)
    expect(moveToSpy).toHaveBeenNthCalledWith(1, 10, 10)
    expect(lineToSpy).toHaveBeenNthCalledWith(1, 20, 20) // Implicit L from M
    expect(moveToSpy).toHaveBeenNthCalledWith(2, 25, 25) // m from 20,20 -> 25,25
    expect(lineToSpy).toHaveBeenNthCalledWith(2, 35, 35) // Implicit l from m
  })

  it("handles H, V, h, v commands", () => {
    const pathStr = "M 10 10 H 20 V 30 h 5 v 5"
    svgPathToShapePath(pathStr)
    expect(lineToSpy).toHaveBeenNthCalledWith(1, 20, 10) // H 20
    expect(lineToSpy).toHaveBeenNthCalledWith(2, 20, 30) // V 30
    expect(lineToSpy).toHaveBeenNthCalledWith(3, 25, 30) // h 5
    expect(lineToSpy).toHaveBeenNthCalledWith(4, 25, 35) // v 5
  })

  it("handles C, c, Q, q, Z, z commands", () => {
    const pathStr =
      "M 10 10 C 20 20 30 30 40 40 Q 50 50 60 60 c 10 10 20 20 30 30 q 10 10 20 20 Z"
    const shapePath = svgPathToShapePath(pathStr)
    expect(bezierCurveToSpy).toHaveBeenNthCalledWith(1, 20, 20, 30, 30, 40, 40)
    expect(quadraticCurveToSpy).toHaveBeenNthCalledWith(1, 50, 50, 60, 60)

    // relative c
    expect(bezierCurveToSpy).toHaveBeenNthCalledWith(2, 70, 70, 80, 80, 90, 90)
    // relative q
    expect(quadraticCurveToSpy).toHaveBeenNthCalledWith(2, 100, 100, 110, 110)

    // Checks if the subpaths exist, meaning Z was called (which operates on currentPath)
    expect(shapePath.subPaths.length).toBeGreaterThan(0)
  })

  it("parses the specific string from the feature request", () => {
    const pathStr = "M17.8764 22.3069L17.915 15.3908L23.83 15.3908"
    svgPathToShapePath(pathStr)
    expect(moveToSpy).toHaveBeenCalledWith(17.8764, 22.3069)
    expect(lineToSpy).toHaveBeenCalledWith(17.915, 15.3908)
    expect(lineToSpy).toHaveBeenCalledWith(23.83, 15.3908)
  })

  it("handles the opentype Path object properly", () => {
    const mockOpenTypePath = {
      commands: [
        { type: "M", x: 10, y: 10 },
        { type: "L", x: 20, y: 20 },
      ],
    } as Parameters<typeof svgPathToShapePath>[0]
    svgPathToShapePath(mockOpenTypePath)
    expect(moveToSpy).toHaveBeenCalledWith(10, 10)
    expect(lineToSpy).toHaveBeenCalledWith(20, 20)
  })
})
