import { Input } from '@headlessui/react'
import './SubmitButton.css'

interface Props {
  label: string
}

export function SubmitButton({ label }: Readonly<Props>) {
  return (
    <div className="submit-button-container">
      <Input type="submit" value={label} className="submit-button" />
    </div>
  )
}
