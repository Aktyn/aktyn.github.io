/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, spyOn, beforeEach, afterEach } from 'bun:test'
import { svgPathToShapePath } from './graphics-helpers'
import * as THREE from 'three'

describe(svgPathToShapePath, () => {
  let moveToSpy: any
  let lineToSpy: any
  let bezierCurveToSpy: any
  let quadraticCurveToSpy: any

  beforeEach(() => {
    moveToSpy = spyOn(THREE.ShapePath.prototype as any, 'moveTo')
    lineToSpy = spyOn(THREE.ShapePath.prototype as any, 'lineTo')
    bezierCurveToSpy = spyOn(THREE.ShapePath.prototype as any, 'bezierCurveTo')
    quadraticCurveToSpy = spyOn(THREE.ShapePath.prototype as any, 'quadraticCurveTo')
  })

  afterEach(() => {
    // Bun cleans up mocks by default or use .mockRestore() on spies
    moveToSpy.mockRestore()
    lineToSpy.mockRestore()
    bezierCurveToSpy.mockRestore()
    quadraticCurveToSpy.mockRestore()
  })

  it('parses the example absolute SVG path correctly', () => {
    const pathStr = 'M 10 20 L 30 40 L 50 60'
    svgPathToShapePath(pathStr)

    expect(moveToSpy).toHaveBeenCalledWith(10, 20)
    expect(lineToSpy).toHaveBeenCalledWith(30, 40)
    expect(lineToSpy).toHaveBeenCalledWith(50, 60)
  })

  it('handles relative path commands', () => {
    const pathStr = 'm 10 10 l 5 5'
    svgPathToShapePath(pathStr)
    expect(moveToSpy).toHaveBeenCalledWith(10, 10)
    expect(lineToSpy).toHaveBeenCalledWith(15, 15) // 10+5, 10+5
  })

  it('handles consecutive coordinates for M and m as L and l', () => {
    const pathStr = 'M 10 10 20 20 m 5 5 10 10'
    svgPathToShapePath(pathStr)
    expect(moveToSpy).toHaveBeenNthCalledWith(1, 10, 10)
    expect(lineToSpy).toHaveBeenNthCalledWith(1, 20, 20) // Implicit L from M
    expect(moveToSpy).toHaveBeenNthCalledWith(2, 25, 25) // m from 20,20 -> 25,25
    expect(lineToSpy).toHaveBeenNthCalledWith(2, 35, 35) // Implicit l from m
  })

  it('handles H, V, h, v commands', () => {
    const pathStr = 'M 10 10 H 20 V 30 h 5 v 5'
    svgPathToShapePath(pathStr)
    expect(lineToSpy).toHaveBeenNthCalledWith(1, 20, 10) // H 20
    expect(lineToSpy).toHaveBeenNthCalledWith(2, 20, 30) // V 30
    expect(lineToSpy).toHaveBeenNthCalledWith(3, 25, 30) // h 5
    expect(lineToSpy).toHaveBeenNthCalledWith(4, 25, 35) // v 5
  })

  it('handles C, c, Q, q, Z, z commands', () => {
    const pathStr = 'M 10 10 C 20 20 30 30 40 40 Q 50 50 60 60 c 10 10 20 20 30 30 q 10 10 20 20 Z'
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

  it('parses the specific string from the feature request', () => {
    const pathStr = 'M17.8764 22.3069L17.915 15.3908L23.83 15.3908'
    svgPathToShapePath(pathStr)
    expect(moveToSpy).toHaveBeenCalledWith(17.8764, 22.3069)
    expect(lineToSpy).toHaveBeenCalledWith(17.915, 15.3908)
    expect(lineToSpy).toHaveBeenCalledWith(23.83, 15.3908)
  })

  it('handles the opentype Path object properly', () => {
    const mockOpenTypePath = {
      commands: [
        { type: 'M', x: 10, y: 10 },
        { type: 'L', x: 20, y: 20 },
      ],
    } as Parameters<typeof svgPathToShapePath>[0]
    svgPathToShapePath(mockOpenTypePath)
    expect(moveToSpy).toHaveBeenCalledWith(10, 10)
    expect(lineToSpy).toHaveBeenCalledWith(20, 20)
  })

  it('handles A, a commands (elliptical arcs)', () => {
    const pathStr = 'M 10 10 A 5 5 0 0 1 20 20 a 5 5 0 0 0 10 10'
    const absellipseSpy = spyOn(THREE.Path.prototype as any, 'absellipse')

    svgPathToShapePath(pathStr)

    expect(absellipseSpy).toHaveBeenCalledTimes(2)

    absellipseSpy.mockRestore()
  })

  it('parses the complex arc path from the feature request without throwing', () => {
    const complexPath =
      'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z'
    const shapePath = svgPathToShapePath(complexPath)
    expect(shapePath.subPaths.length).toBeGreaterThan(0)
  })

  it('handles T, t, S, s commands (smooth curves)', () => {
    // A path using Q followed by T, and C followed by S
    const pathStr = 'M 10 10 Q 20 20 30 10 T 50 10 C 60 20 70 20 80 10 S 100 0 110 10'
    svgPathToShapePath(pathStr)

    // M 10 10
    expect(moveToSpy).toHaveBeenCalledWith(10, 10)

    // Q 20 20 30 10
    // currentPoint is 30 10. controlPoint is 20 20
    expect(quadraticCurveToSpy).toHaveBeenCalledWith(20, 20, 30, 10)

    // T 50 10
    // rx = current.x * 2 - control.x = 30 * 2 - 20 = 40
    // ry = current.y * 2 - control.y = 10 * 2 - 20 = 0
    expect(quadraticCurveToSpy).toHaveBeenCalledWith(40, 0, 50, 10)

    // C 60 20 70 20 80 10
    // currentPoint is 80 10. controlPoint is 70 20
    expect(bezierCurveToSpy).toHaveBeenCalledWith(60, 20, 70, 20, 80, 10)

    // S 100 0 110 10
    // rx = 80 * 2 - 70 = 90
    // ry = 10 * 2 - 20 = 0
    expect(bezierCurveToSpy).toHaveBeenCalledWith(90, 0, 100, 0, 110, 10)
  })

  it('prevents infinite loop on unsupported commands', () => {
    const consoleWarnSpy = spyOn(console, 'warn').mockImplementation(() => {})
    // 'J' is an unsupported command (fake)
    const pathStr = 'M 10 10 J 20 20 L 50 50'
    svgPathToShapePath(pathStr)

    // It should successfully process M and L, skipping J and its arguments.
    expect(moveToSpy).toHaveBeenCalledWith(10, 10)
    expect(lineToSpy).toHaveBeenCalledWith(50, 50)
    expect(consoleWarnSpy).toHaveBeenCalledWith('Unsupported SVG command: J')

    consoleWarnSpy.mockRestore()
  })
})
