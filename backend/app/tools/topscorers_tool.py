from typing import Any, Dict
from app.tools.base import BaseTool
from app.services.api_clients.all_sports_client import AllSportsClient

class TopScorersTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="topscorers",
            description="Récupère les meilleurs buteurs d'une ligue",
            supported_sports=["football"]
        )
        self.client = AllSportsClient()

    def run(self, input_data: Any) -> Dict[str, Any]:
        league_name = input_data.get("league")
        league_id = input_data.get("league_id")
        sport = input_data.get("sport", "football")

        if not league_id and league_name:
            leagues = self.client.get_leagues()
            for lg in leagues:
                if league_name.lower() in lg.get("league_name", "").lower():
                    league_id = lg.get("league_key")
                    break
        
        if not league_id:
            return {"error": "L'ID ou le nom de la ligue est obligatoire."}

        try:
            scorers = self.client.get_topscorers(league_id)
            return {
                "type": "topscorers",
                "sport": sport,
                "league_id": league_id,
                "scorers": scorers
            }
        except Exception as e:
            return {"error": str(e)}
