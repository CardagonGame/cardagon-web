import { createFileRoute } from '@tanstack/react-router'
import { GameHomeMenu } from '../components/GameHomeMenu'
import { UserMenu } from '../components/UserMenu'
import '../styles/routes/home.css'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="home-page">
      <UserMenu />
      <div className="logo-container">
        <img src="/src/assets/logo.png" alt="Cardagon Logo" className="logo" />
        <p>Cardagon</p>
      </div>
      <GameHomeMenu />
    </div>
  )
}
