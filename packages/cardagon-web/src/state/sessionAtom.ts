import { atomWithStorage } from 'jotai/utils'
import type { Session } from '../interfaces/Session'

export const sessionAtom = atomWithStorage<Session | null>('session', null)
