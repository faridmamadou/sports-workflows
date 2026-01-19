from typing import Any, Dict
from app.tools.base import BaseTool
from app.services.api_clients.all_sports_client import AllSportsClient

class TeamInfoTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="team_info",
            description="Récupère les informations et l'effectif d'une équipe",
            supported_sports=["football"]
        )
        self.client = AllSportsClient()

    def run(self, input_data: Any) -> Dict[str, Any]:
        team_name = input_data.get("team")
        team_id = input_data.get("team_id")
        sport = input_data.get("sport", "football")

        if not team_id and team_name:
            team_id = self.client._get_team_id(team_name)
        
        if not team_id:
            return {"error": f"Équipe '{team_name or team_id}' non trouvée."}

        try:
            team_details = self.client.get_team_details(team_id)
            return {
                "type": "team_info",
                "sport": sport,
                "team_id": team_id,
                "team_details": team_details
            }
        except Exception as e:
            return {"error": str(e)}
