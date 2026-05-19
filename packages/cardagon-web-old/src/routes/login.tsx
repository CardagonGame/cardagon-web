import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LoginForm } from '../components/auth/LoginForm'
import { useAuth } from '../hooks/useAuth'
import '../styles/routes/login.css'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { session } = useAuth({ noRedirect: true })

  if (session) {
    return navigate({ to: '/' })
  }

  return (
    <div className="login">
      <LoginForm />
    </div>
  )
}
