import { useNavigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import type { UserSession } from '../interfaces/UserSession'
import api from '../methods/api'
import { sessionAtom } from '../state/sessionAtom'

interface Options {
  noRedirect?: boolean
}

export const useAuth = ({ noRedirect }: Options = {}) => {
  const navigate = useNavigate()
  const session = useAtomValue(sessionAtom)
  const [userSession, setUserSession] = useState<UserSession | null>(null)

  useEffect(() => {
    if (!session && !noRedirect) {
      navigate({ to: '/login' })
      return
    }

    if (!noRedirect && !userSession) {
      api.getMe().then(({ data, error }) => {
        if (error) {
          navigate({ to: '/login' })
          return
        }
        if (data?.id) {
          setUserSession({
            userId: data.id,
            username: data.username,
            email: data.email,
          })
        }
      })
    }
  }, [session])

  return { session: userSession }
}
