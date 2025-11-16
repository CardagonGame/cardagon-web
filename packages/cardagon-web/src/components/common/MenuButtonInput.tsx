import { Button, Input } from '@headlessui/react'
import { clsx } from 'clsx'
import { useState } from 'react'
import './MenuButtonInput.css'

interface Props {
  onClick?: (value: string) => void
  label: string
  inputLabel: string
  disabled?: boolean
}

export function MenuButtonInput({
  onClick,
  label,
  disabled,
  inputLabel,
}: Props) {
  const [inputValue, setInputValue] = useState('')

  const onBtnClick = () => {
    if (onClick) {
      onClick?.(inputValue)
    }
  }

  return (
    <div className="menu-button-input">
      <Input
        className={clsx('input', disabled && 'disabled')}
        type="text"
        placeholder={inputLabel}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={disabled}
      />
      <Button
        className={clsx('button', disabled && 'disabled')}
        onClick={onBtnClick}
      >
        {label}
      </Button>
    </div>
  )
}
