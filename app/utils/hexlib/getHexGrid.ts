import { getGridCoordinates } from './getGridCoordinates'
import { getGridRowCount } from './getGridRowCount'
import { getHeightFromRadius } from './getHeightFromRadius'
import type { Hex } from './interfaces/Hex'

export function getHexGrid(radius: number) {
  const hexHeight = getHeightFromRadius(radius)

  return Array.from({ length: hexHeight }).map((_, colIndex) =>
    Array.from({ length: getGridRowCount(radius, colIndex) }).map(
      (_, rowIndex) => {
        const { q, r, s } = getGridCoordinates(radius, colIndex, rowIndex)
        return {
          colIndex,
          rowIndex,
          q,
          r,
          s,
        } satisfies Hex
      },
    ),
  )
}
