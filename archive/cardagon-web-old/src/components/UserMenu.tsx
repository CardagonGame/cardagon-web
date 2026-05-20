import { useAuth } from '../hooks/useAuth'
import './UserMenu.css'

export function UserMenu() {
  const { session } = useAuth()

  return (
    <div className="user-menu">
      <div className="profile-image i-pixelarticons:user"></div>
      <span className="username">{session?.username}</span>
    </div>
  )
}
