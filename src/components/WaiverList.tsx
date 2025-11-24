import { useState, useEffect } from "react";
import { mapPlayersToOwners } from "../functions";
import { User } from "../types";
import { LEAGUE_ID } from "../constants";

type Player = {
  player_id: number;
  full_name: string;
};

export default function WaiverList() {
  const [trendingPlayers, setTrendingPlayers] = useState<Player[]>([]);
  const [leagueData, setLeagueData] = useState<any>(null);
  const [userNames, setUserNames] = useState<string[]>([]);

  console.log('userNames', userNames);
  let playerOwnerMap;

  if(trendingPlayers && leagueData) { 
    playerOwnerMap = mapPlayersToOwners(trendingPlayers, leagueData);

    if(userNames) { 
      const ownerIndexMap: { [ownerId: string]: number } = {};
      leagueData.forEach((user: User, index: number) => {
        ownerIndexMap[user.owner_id] = index;
      })
      playerOwnerMap = playerOwnerMap.map(player => {
        const ownerIndex = ownerIndexMap[player.owner_id] ?? null;
        const userName = userNames[ownerIndex];
        return {
          ...player,
          user_name: userName
        }
      })
    }
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

  useEffect (()=> { 
    if(leagueData) { 


  const getUserNames = async () => { 
    const ownerDataPromises = leagueData.map(async (user: User) => {
      const res = await fetch(`https://api.sleeper.app/v1/user/${user.owner_id}`);
      return res.json();
    });
  
    const ownerDataList = await Promise.all(ownerDataPromises);
    const userNames =  ownerDataList.map(owner => owner.display_name);
    setUserNames(userNames);    
  }
  getUserNames();
    }
  }, [leagueData]);
  console.log('userNames', userNames);
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
              {p.user_name && `-> ${p.user_name}` }
            </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
