import { Description, Field, Input, Label } from '@headlessui/react'
import type { HTMLInputTypeAttribute, Ref } from 'react'
import type { FieldError } from 'react-hook-form'
import './FormInput.css'

interface Props {
  label: string
  description?: string
  onChange?: (event: { target: HTMLInputElement }) => Promise<void | boolean>
  onBlur?: (event: { target: HTMLInputElement }) => Promise<void | boolean>
  ref?: Ref<HTMLInputElement>
  name?: string
  min?: string | number
  max?: string | number
  maxLength?: number
  minLength?: number
  pattern?: string
  required?: boolean
  disabled?: boolean
  type?: HTMLInputTypeAttribute
  error?: FieldError
}

export function FormInput({
  label,
  description,
  onChange,
  onBlur,
  ref,
  name,
  min,
  max,
  maxLength,
  minLength,
  pattern,
  required,
  disabled,
  error,
  type,
}: Readonly<Props>) {
  return (
    <div className="form-input">
      <Field>
        <Label className="form-label">{label}</Label>
        {description && (
          <Description className="form-description">{description}</Description>
        )}
        <Input
          className="form-input-field"
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          name={name}
          min={min}
          max={max}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          required={required}
          disabled={disabled}
          type={type}
        />
        {error && <p className="form-input-error">{error?.message}</p>}
      </Field>
    </div>
  )
}
