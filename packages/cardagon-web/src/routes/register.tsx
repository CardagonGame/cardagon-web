import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { RegisterForm } from '../components/auth/RegisterForm'
import { useAuth } from '../hooks/useAuth'
import '../styles/routes/register.css'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { session } = useAuth({ noRedirect: true })

  if (session) {
    return navigate({ to: '/' })
  }

  return (
    <div className="register">
      <RegisterForm />
    </div>
  )
}
