import { Input } from '@headlessui/react'
import './SubmitButton.css'

interface Props {
  label: string
}

export function SubmitButton({ label }: Readonly<Props>) {
  return <Input type="submit" value={label} className="submit-button" />
}
