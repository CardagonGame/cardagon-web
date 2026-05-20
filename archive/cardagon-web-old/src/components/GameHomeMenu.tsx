import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import api from '../methods/api'
import { MenuButton } from './common/MenuButton'
import { MenuButtonInput } from './common/MenuButtonInput'
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

  const joinGame = async (joinCode: string) => {
    const { data, error } = await api.joinGame({ params: { joinCode } })

    if (error) {
      console.log('Join game error:', error)
      toast.error(error?.data?.detail?.toString() || 'Could not join the game.')
    }

    if (data) {
      navigate({ to: `/game/${data.game_id}` })
    }
  }
  return (
    <div className="game-home-menu">
      <MenuButton label="Create New Game" onClick={createNewGame} />
      <MenuButtonInput
        label="Join"
        inputLabel="Enter Code"
        onClick={joinGame}
      />
      <MenuButton label="Settings" disabled />
    </div>
  )
}
