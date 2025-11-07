import { useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { sessionAtom } from '../state/sessionAtom'

interface Options {
  noRedirect?: boolean
}

export const useAuth = ({ noRedirect }: Options = {}) => {
  const navigate = useNavigate()
  const session = useAtomValue(sessionAtom)
  useEffect(() => {
    console.log('useAuth session:', session)
    if (!session && !noRedirect) {
      navigate({ to: '/login' })
    }
  }, [session])

  return { session }
}
