import { useState, useEffect } from "react";
import { mapPlayersToOwners } from "../functions";

type Player = {
  player_id: number;
  full_name: string;
};

export default function WaiverList() {
  const [trendingPlayers, setTrendingPlayers] = useState<Player[]>([]);
  const [leagueData, setLeagueData] = useState<any>(null);
  const LEAGUE_ID = "1278224878310260736";


  let playerOwnerMap;

  if(trendingPlayers && leagueData) { 
    console.log('league data', leagueData);
    console.log('users',leagueData?.users)
    console.log('rosters',leagueData?.rosters)
    playerOwnerMap = mapPlayersToOwners(trendingPlayers, leagueData,);
    console.log('playerOwnerMap', playerOwnerMap);
  }

  async function fetchData() {
    try {
      const response = await fetch(
        "https://api.sleeper.app/v1/players/nba/trending/add?lookback_hours=24&limit=30"
      );
      const allPlayers = await fetch("https://api.sleeper.app/v1/players/nba");

      const myLeague = await fetch(
        `https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`
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

      setTrendingPlayers(trendingPlayers);
      setLeagueData(myLeague);
      return {
        trendingData,
        playerData,
        myLeague,
      };
    } catch (err: any) {
      console.log(err);
    }
  } 
  useEffect(() => {
    fetchData();
  }, []);


  return (
  
  <div className="waiverList">
    <div className="waiverListHeader">
      <h1>Waiver List</h1>
    </div>
    <div className="waiverListBody">
      <ul> {playerOwnerMap && playerOwnerMap.map((p: any) => (
          <li key={p.player_id}>
            <div className="waiverListPlayer">
              {p.player_name} 
              {p.owner_id && `-> ${p.owner_id}` }
            </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
