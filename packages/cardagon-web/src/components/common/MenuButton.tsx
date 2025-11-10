import { Button } from '@headlessui/react'
import { clsx } from 'clsx'
import './MenuButton.css'

interface Props {
  onClick?: () => void
  label: string
  disabled?: boolean
}

export function MenuButton({ onClick, label, disabled }: Props) {
  return (
    <Button
      className={clsx('button', disabled && 'disabled')}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
