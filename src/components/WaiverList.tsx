import { AnyARecord } from "dns";
import { useState, useEffect } from "react";

type Player = {
  player_id: number;
  full_name: string;
};

export default function WaiverList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const leagueId = "1278224878310260736";

  async function fetchData() {
    try {
      const response = await fetch(
        "https://api.sleeper.app/v1/players/nba/trending/add?lookback_hours=24&limit=30"
      );
      const allPlayers = await fetch("https://api.sleeper.app/v1/players/nba");

      const myLeague = await fetch(
        `https://api.sleeper.app/v1/league/${leagueId}/rosters`
      )
        .then((r) => r.json())
        .catch(() => null);
      console.log("my league", myLeague);

      if (!response.ok || !allPlayers.ok) {
        throw new Error("Unsuccessful Fetch");
      }
      const trendingData = await response.json();
      const playerData = await allPlayers.json();

      console.log(trendingData);
      console.log(playerData);

      const trendingPlayers = trendingData.map((i: any) => {
        return { ...playerData[i.player_id], count: i.count };
      });

      trendingPlayers.sort((a: any, b: any) => b.count - a.count);
      console.log("trending players", trendingPlayers);

      setPlayers(trendingPlayers);
      return {
        playerData,
        trendingData,
        myLeague,
      };
    } catch (err: any) {
      console.log(err);
    }
  }

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

  useEffect(() => {
    fetchData();
    if (players) {
      console.log(fetchData());
    }
  }, []);

  console.log("players", players);

  return (
    <ul>
      {" "}
      {players?.map((item) => (
        <li> {item.full_name} </li>
      ))}{" "}
    </ul>
  );
}

