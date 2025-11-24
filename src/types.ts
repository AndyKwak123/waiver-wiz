export type User = { user_id: string; display_name: string, owner_id: string, players: Player[] };
export type Roster = { roster_id: number; owner_id: string; players: string[] };
export type Player = { player_id: number; full_name: string };