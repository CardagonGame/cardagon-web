import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { RegisterFormData } from '../interfaces/form/RegisterFormData'
import api from '../methods/api'
import { AuthFrame } from './AuthFrame'
import { FormInput } from './form/FormInput'
import { SubmitButton } from './form/SubmitButton'

export function RegisterForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const onSubmit = async (formData: RegisterFormData) => {
    const { data, error } = await api.register({
      body: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        invite_token: formData.inviteToken,
      },
    })

    if (error) {
      console.log('Registration error:', error)
      toast.error(
        error?.data?.detail?.[0]?.msg || 'An error occurred during registration.',
      )
      return
    }

    if (data) {
      toast.success(`Registration successful! Welcome ${data?.username}`)
    }
  }

  return (
    <AuthFrame title="Register" onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Username"
        description="Not unique, can be up to 50 characters."
        error={errors.username}
        {...register('username')}
      />
      <FormInput
        label="Email"
        type="email"
        error={errors.email}
        {...register('email')}
      />
      <FormInput
        label="Password"
        type="password"
        error={errors.password}
        {...register('password')}
      />
      <FormInput
        label="Repeat Password"
        type="password"
        error={errors.repeatPassword}
        {...register('repeatPassword')}
      />
      <FormInput
        label="Invite Token"
        error={errors.inviteToken}
        {...register('inviteToken')}
      />

      <SubmitButton label="Register" />
      <p className="help-text">
        Alrady have an account? <Link to="/login">Login here</Link>
      </p>
    </AuthFrame>
  )
}
