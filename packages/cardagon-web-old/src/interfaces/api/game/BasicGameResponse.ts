export interface BasicGameResponse {
  game_id: string
  join_code: string
  your_role: 'host' | 'player'
}
