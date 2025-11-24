import { Player, User } from "./types";

// Go through trending list and return user of who it belongs to
export function mapPlayersToOwners(
  trendingPlayers: Player[],
  leagueData: any
) {

  const userMap = leagueData?.map((user: User) => { 
    return { 
      [user.owner_id]: user.players
    }
  })
  // Map owner_id -> user name
  const trendingPlayerInfoList = trendingPlayers.map(player => {return {full_name: player.full_name, player_id: player.player_id}});
  const ownerLookup: { [playerId: string]: string } = {};

  for (const entry of userMap) {
    const ownerId = Object.keys(entry)[0];
    const players = entry[ownerId] || [];  // guard against undefined
    
    for (const player of players) {
      ownerLookup[player] = ownerId;
    }
  }

const trendingOwners = trendingPlayerInfoList.map((player: Player) => {
    return {    
      player_id: player.player_id,
      player_name: player.full_name,
      owner_id: ownerLookup[String(player.player_id)] ?? null, // null if nobody owns player
    }
});
  return trendingOwners;
}
