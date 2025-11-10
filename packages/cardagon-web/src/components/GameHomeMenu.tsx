import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import api from '../methods/api'
import { MenuButton } from './common/MenuButton'
import './GameHomeMenu.css'

export function GameHomeMenu() {
  const navigate = useNavigate()
  const createNewGame = async () => {
    const { data, error } = await api.createGame()

    if (error) {
      console.log('Create game error:', error)
      toast.error(
        error?.data?.detail?.toString() || 'Could not create a new game.',
      )
    }

    if (data) {
      navigate({ to: `/game/${data.game_id}` })
    }
  }

  const joinGame = () => {
    // Logic to join an existing game
  }
  return (
    <div className="game-home-menu">
      <MenuButton label="Create New Game" onClick={createNewGame} />
      <MenuButton label="Join Game" />
      <MenuButton label="Settings" disabled />
    </div>
  )
}
