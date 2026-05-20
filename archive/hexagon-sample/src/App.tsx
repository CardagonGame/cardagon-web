import type { Hex } from '@cardagon/hexlib'
import { getHeightFromRadius, getHexGrid, hexEquals } from '@cardagon/hexlib'
import clsx from 'clsx'
import { useState, type ChangeEvent, type CSSProperties } from 'react'
import './App.scss'

function App() {
  const [hexRadius, setHexRadius] = useState(8)

  const hexHeight = getHeightFromRadius(hexRadius)

  const hexGrid = getHexGrid(hexRadius)

  const onHexRadiusChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(parseInt(event?.target?.value))) {
      setHexRadius(parseInt(event.target.value))
    }
  }

  const [hoveredHex, setHoveredHex] = useState<Hex>()

  const isHoveredHex = (hex: Hex) => {
    return hexEquals(hex, hoveredHex)
  }

  const isAxialHex = (hex: Hex) => {
    if (hexEquals(hex, hoveredHex)) {
      return false
    }
    return (
      hex.q === hoveredHex?.q ||
      hex.r === hoveredHex?.r ||
      hex.s === hoveredHex?.s
    )
  }

  const hexGridStyle = {
    '--hex-height': `calc(100vh / ${hexHeight})`,
  } as CSSProperties

  return (
    <>
      <input
        className="hex-radius"
        type="number"
        onChange={onHexRadiusChange}
        value={hexRadius}
      />
      <div className="hex-grid" style={hexGridStyle}>
        {hexGrid.map((rows, i) => (
          <div className="column" key={i}>
            {rows.map((hex, j) => (
              <div
                className={clsx(
                  'hexagon',
                  isHoveredHex(hex) && 'hovered',
                  isAxialHex(hex) && 'neighboring',
                )}
                key={j}
                onMouseEnter={() => setHoveredHex(hex)}
                onMouseLeave={() => setHoveredHex(hex)}
              >
                <div className="hex-content">
                  <div className="hex-content-inner">
                    <div className="r">{hex.r}</div>
                    <div className="q">{hex.q}</div>
                    <div className="s">{hex.s}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
