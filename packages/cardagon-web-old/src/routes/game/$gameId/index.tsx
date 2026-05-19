import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'
import api from '../../../methods/api'

export const Route = createFileRoute('/game/$gameId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return api.getGameBasicInfo({ params: { gameId: params.gameId } })
  },
})

function RouteComponent() {
  const { gameId } = Route.useParams()
  const { data: gameData, error: gameDataError } = Route.useLoaderData()

  useEffect(() => {
    if (gameDataError) {
      toast.error(
        gameDataError?.data?.detail?.toString() || 'Could not load game data.',
      )
    }
  }, [gameDataError])

  return (
    <div>
      Hello "/game/{gameId}"! Join with code {gameData?.join_code}
    </div>
  )
}
