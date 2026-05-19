import { Link, useNavigate } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { LoginFormData } from '../../interfaces/form/LoginFormData'
import api from '../../methods/api'
import { sessionAtom } from '../../state/sessionAtom'
import { AuthFrame } from './AuthFrame'
import { FormInput } from '../form/FormInput'
import { SubmitButton } from '../form/SubmitButton'

export function LoginForm() {
  const navigate = useNavigate()
  const { handleSubmit, register } = useForm<LoginFormData>()
  const setSession = useSetAtom(sessionAtom)

  const onSubmit = async (formData: LoginFormData) => {
    const formDataObject = new FormData()

    formDataObject.append('username', formData.email)
    formDataObject.append('password', formData.password)

    const { data, error } = await api.login({
      body: formDataObject,
    })

    if (error) {
      console.log('Login error:', error)
      toast.error(
        error?.data?.detail?.toString() || 'An error occurred during login.',
      )
      return
    }

    if (data) {
      setSession({ token: data.access_token })
      navigate({ to: '/' })
    }
  }

  return (
    <AuthFrame title="Login" onSubmit={handleSubmit(onSubmit)}>
      <FormInput label="Email" {...register('email')} />
      <FormInput label="Password" type="password" {...register('password')} />

      <SubmitButton label="Login" />
      <p className="help-text">
        Don't have an account yet? <Link to="/register">Register here</Link>
      </p>
    </AuthFrame>
  )
}
