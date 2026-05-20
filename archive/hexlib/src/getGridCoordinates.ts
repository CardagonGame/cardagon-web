import { getHeightFromRadius } from './getHeightFromRadius'

export function getGridCoordinates(
  radius: number,
  colIndex: number,
  rowIndex: number,
) {
  const hexHeight = getHeightFromRadius(radius)
  const half = Math.floor(hexHeight / 2)
  const q = colIndex - half
  let r = rowIndex - Math.min(colIndex, hexHeight - colIndex - 1)
  let s = -q - r
  if (colIndex > half) {
    s = -q - r + (colIndex - half)
    r = -q - s
  }
  return { q, s, r }
}
