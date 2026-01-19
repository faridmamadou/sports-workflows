from typing import Any, Dict, List
from app.tools.base import BaseTool
from app.services.api_clients.all_sports_client import AllSportsClient
from app.models.match import MatchInfo
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class MatchInfoTool(BaseTool):
    def __init__(self):
         super().__init__(
            name="match_info",
            description="Informations sur des matchs joués",
            supported_sports=["football", "basketball", "tennis"] # Example sports
        )
         self.client = AllSportsClient()

    def run(self, input_data: Any) -> Dict[str, Any]:
        sport = input_data.get("sport")
        team = input_data.get("team")
        opponent = input_data.get("opponent")
        season = input_data.get("season")
        date_str = input_data.get("date")
        league_name = input_data.get("league")
        details = input_data.get("details") 
        
        if not sport:
            return {"error": "Le sport est obligatoire."}

        # Handle H2H
        if team and opponent:
            try:
                team_id = self.client._get_team_id(team)
                opponent_id = self.client._get_team_id(opponent)
                if not team_id or not opponent_id:
                    return {"error": f"Impossible de trouver l'ID pour {team} ou {opponent}"}
                
                h2h_data = self.client.get_h2h(team_id, opponent_id)
                # H2H returns a complex object with "H2H" (past matches), "firstTeamResults", etc.
                # We prioritize "H2H" list.
                matches = h2h_data.get("H2H", [])
                
                # Normalize matches
                normalized_matches = self._normalize_matches(matches, sport)
                
                return {
                    "type": "h2h",
                    "sport": sport,
                    "team": team,
                    "opponent": opponent,
                    "matches": normalized_matches,
                    "raw_data": h2h_data # Optionally return more data
                }

            except Exception as e:
                return {"error": f"Erreur H2H: {str(e)}"}

        # Handle Standard Search (Team or League)
        match_date = None
        date_from = None
        date_to = None

        if date_str:
            try:
                match_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                date_from = match_date
                date_to = match_date
            except ValueError:
                return {"error": "Format de date invalide. Utilisez YYYY-MM-DD."}
        elif season:
            try:
                year = int(season)
                date_from = datetime(year, 1, 1).date()
                date_to = datetime(year, 12, 31).date()
            except ValueError:
                 return {"error": "Format de saison invalide. Utilisez une année (ex: 2019)."}
        
        league_id = None
        if league_name:
             # Basic resolution: Fetch all leagues and fuzzy match
             leagues = self.client.get_leagues()
             for lg in leagues:
                 if league_name.lower() in lg.get("league_name", "").lower():
                     league_id = lg.get("league_key")
                     print(f"DEBUG: Resolved league '{league_name}' to {league_id} ({lg.get('league_name')})")
                     break
        
        with_player_stats = False
        if details and ("stats" in details or "player_stats" in details):
            with_player_stats = True

        try:
            raw_matches = self.client.get_finished_matches(
                sport=sport,
                team_name=team, 
                league_id=league_id,
                date_from=date_from, 
                date_to=date_to,
                with_player_stats=with_player_stats
            )
            
            normalized_matches = self._normalize_matches(raw_matches, sport)

            return {
                "type": "match_info",
                "sport": sport,
                "team": team,
                "league": league_name,
                "matches": normalized_matches
            }

        except ValueError as e:
            return {"error": str(e)}
        except RuntimeError as e:
            return {"error": str(e)}
        except Exception as e:
            return {"error": f"Erreur interne: {str(e)}"}

    def _normalize_matches(self, matches: List[Dict[str, Any]], sport: str) -> List[Dict[str, Any]]:
        normalized = []
        for m in matches:
            try:
                home_score = 0
                away_score = 0
                final_result = m.get("event_final_result", "")
                if " - " in final_result:
                    parts = final_result.split(" - ")
                    if len(parts) == 2:
                        try:
                            home_score = int(parts[0])
                            away_score = int(parts[1])
                        except ValueError:
                            pass
                
                match_info = MatchInfo(
                    match_id=str(m.get("event_key")),
                    sport=sport,
                    league=m.get("league_name"),
                    home_team=m.get("event_home_team"),
                    away_team=m.get("event_away_team"),
                    home_score=home_score,
                    away_score=away_score,
                    match_date=datetime.strptime(m.get("event_date"), "%Y-%m-%d").date(),
                    status=m.get("event_status")
                )
                
                normalized.append(match_info.model_dump())
            except Exception:
                continue
        return normalized
