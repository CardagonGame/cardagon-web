import type { Hex } from './interfaces/Hex'

export function hexEquals(hexA?: Hex, hexB?: Hex) {
  return (
    hexA && hexB && hexA.q === hexB.q && hexA.r === hexB.r && hexA.s === hexB.s
  )
}
