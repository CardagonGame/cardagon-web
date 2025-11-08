import type { ReactNode } from 'react'
import './AuthFrame.css'

interface Props {
  children: ReactNode
  title: string
  onSubmit?: () => void
}

export function AuthFrame({ children, title, onSubmit }: Props) {
  return (
    <div className="auth-frame">
      <form className="auth-frame-inner" onSubmit={onSubmit}>
        <div className="auth-frame-max-width">
          <div>
            <img
              src="src/assets/logo.png"
              alt="Cardagon Logo"
              className="auth-frame-form-logo"
            />
            <p className="auth-frame-text">{title}</p>
          </div>
          {children}
        </div>
      </form>
    </div>
  )
}
