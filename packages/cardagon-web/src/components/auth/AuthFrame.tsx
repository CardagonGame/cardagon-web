import type { ReactNode } from 'react'
import { Frame } from '../common/Frame'
import './AuthFrame.css'

interface Props {
  children: ReactNode
  title: string
  onSubmit?: () => void
}

export function AuthFrame({ children, title, onSubmit }: Props) {
  return (
    <Frame>
      <form onSubmit={onSubmit} className="auth-frame">
        <div>
          <img
            src="src/assets/logo.png"
            alt="Cardagon Logo"
            className="auth-frame-form-logo"
          />
          <p className="auth-frame-text">{title}</p>
        </div>
        {children}
      </form>
    </Frame>
  )
}
