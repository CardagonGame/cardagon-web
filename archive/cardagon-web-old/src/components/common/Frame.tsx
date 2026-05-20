import type { CSSProperties, ReactNode } from 'react'
import './Frame.css'

interface Props {
  children: ReactNode
  style?: CSSProperties
}
export function Frame({ children, style }: Props) {
  return (
    <div className="frame" style={style}>
      <div className="frame-inner">
        <div className="frame-max-width">{children}</div>
      </div>
    </div>
  )
}
