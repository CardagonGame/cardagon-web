import clsx from 'clsx'
import { useState } from 'react'
import './App.scss'

function App() {
  const hexRadius = 8
  const hexHeight = hexRadius * 2 - 1

  const columns = Array.from({ length: hexHeight })

  const getRowCount = (colIndex: number) => {
    const half = Math.floor(hexHeight / 2)
    if (colIndex < half) {
      return hexHeight - (hexHeight / 2 - colIndex) + 1
    } else if (colIndex === half) {
      return hexHeight
    } else {
      return hexHeight - colIndex + half
    }
  }

  const getCoordinates = (
    colIndex: number,
    rowIndex: number,
  ): { q: number; s: number; r: number } => {
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

  const [hoveredHex, setHoveredHex] = useState<{
    q: number
    r: number
    s: number
  }>()

  const isHoveredHex = ({ q, r, s }: { q: number; r: number; s: number }) => {
    return (
      hoveredHex &&
      hoveredHex.q === q &&
      hoveredHex.r === r &&
      hoveredHex.s === s
    )
  }

  const isAxialHex = ({ q, r, s }: { q: number; r: number; s: number }) => {
    if (q === hoveredHex?.q && r === hoveredHex?.r && s === hoveredHex?.s) {
      return false
    }
    return q === hoveredHex?.q || r === hoveredHex?.r || s === hoveredHex?.s
  }

  return (
    <div className="hex-grid">
      {columns.map((_, i) => (
        <div className="column" key={i}>
          {Array.from({ length: getRowCount(i) }).map((_, j) => (
            <div
              className={clsx(
                'hexagon',
                isHoveredHex(getCoordinates(i, j)) && 'hovered',
                isAxialHex(getCoordinates(i, j)) && 'neighboring',
              )}
              key={j}
              onMouseEnter={() => setHoveredHex(getCoordinates(i, j))}
              onMouseLeave={() => setHoveredHex(undefined)}
            >
              <div className="hex-content">
                <div className="hex-content-inner">
                  <div className="r">{getCoordinates(i, j).r}</div>
                  <div className="q">{getCoordinates(i, j).q}</div>
                  <div className="s">{getCoordinates(i, j).s}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default App
