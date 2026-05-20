import { getHeightFromRadius } from './getHeightFromRadius'

export function getGridRowCount(radius: number, colIndex: number) {
  const hexHeight = getHeightFromRadius(radius)
  const half = Math.floor(hexHeight / 2)
  if (colIndex < half) {
    return hexHeight - (hexHeight / 2 - colIndex) + 1
  } else if (colIndex === half) {
    return hexHeight
  } else {
    return hexHeight - colIndex + half
  }
}
