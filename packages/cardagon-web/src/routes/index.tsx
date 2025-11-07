import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { session } = useAuth()

  return (
    <div>
      <h3>Welcome Home, {session?.username}</h3>
    </div>
  )
}
