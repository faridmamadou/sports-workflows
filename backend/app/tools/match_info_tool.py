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
        date_str = input_data.get("date")
        
        if not sport or not team:
            return {"error": "Le sport et l'équipe sont obligatoires."}

        match_date = None
        if date_str:
            try:
                match_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                return {"error": "Format de date invalide. Utilisez YYYY-MM-DD."}

        try:
            # We searching for matches. The prompt implies getting *finished* matches.
            # Client method is get_finished_matches.
            # We might need a range if date is not specific? 
            # The prompt example input has a specific date: "2024-01-10"
            
            raw_matches = self.client.get_finished_matches(
                sport=sport,
                team_name=team,
                date_from=match_date,
                date_to=match_date
            )
            
            normalized_matches = []
            for m in raw_matches:
                try:
                    # Parsing score "2 - 1"
                    home_score = 0
                    away_score = 0
                    final_result = m.get("event_final_result", "")
                    if " - " in final_result:
                        parts = final_result.split(" - ")
                        if len(parts) == 2:
                            # Handle potential non-numeric (penalties etc, though usually separate)
                            # Actually API returns "2 - 1".
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
                    normalized_matches.append(match_info.model_dump())
                except Exception as e:
                    # Log error in production. Skip malformed match.
                    continue

            return {
                "type": "match_info",
                "sport": sport,
                "team": team,
                "matches": normalized_matches
            }

        except ValueError as e:
            return {"error": str(e)}
        except RuntimeError as e:
            return {"error": str(e)}
        except Exception as e:
            return {"error": f"Erreur interne: {str(e)}"}
