type User = { user_id: string; display_name: string };
type Roster = { roster_id: number; owner_id: string; players: string[] };

function mapPlayersToOwners(
  trendingPlayers: string[],
  rosters: Roster[],
  users: User[]
) {
  // Map owner_id -> user name
  const userMap = Object.fromEntries(
    users.map((u) => [u.user_id, u.display_name])
  );

  // Map player_id -> owner
  const playerOwnerMap: Record<string, string | null> = {};

  for (const playerId of trendingPlayers) {
    const roster = rosters.find((r) => r.players.includes(playerId));
    playerOwnerMap[playerId] = roster ? userMap[roster.owner_id] : null;
  }

  return playerOwnerMap;
}
