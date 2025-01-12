import { useState, useEffect } from 'react'
export interface DimensionObject {
  width: number
  height: number
  top: number
  left: number
  x: number
  y: number
  right: number
  bottom: number
}
const getDimensionObject = (node: DOMRect): DimensionObject => {
  return {
    width: node.width,
    height: node.height,
    top: node.top,
    left: node.left,
    x: node.x,
    y: node.y,
    right: node.right,
    bottom: node.bottom
  }
}
/**
 * useDimensions - a React Hook to measure DOM nodes
 * This is useful when you have to align items, or respond to browser width, or ... lots of reasons.
 * @param ref
 */
export const useDimensions = <T extends Element>(ref: React.RefObject<T>) => {
  const [dimensions, setdDimensions] = useState<Partial<DimensionObject>>({})
  const rangeSize = ref.current
  useEffect(() => {
    if (rangeSize) {
      const observer = new ResizeObserver(() => {
        const node = rangeSize.getBoundingClientRect()
        setdDimensions(node)
        getDimensionObject(node)
      })
      observer.observe(rangeSize)
      return () => {
        observer.unobserve(rangeSize)
      }
    }
  }, [rangeSize])
  return dimensions
}
