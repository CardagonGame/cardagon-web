import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = useAuth()

  return (
    <div>
      <p>Welcome Home, {session?.username}</p>
    </div>
  )
}
