from typing import Any, Dict
from app.tools.base import BaseTool
from app.services.api_clients.all_sports_client import AllSportsClient

class VideosTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="videos",
            description="Récupère les vidéos/highlights d'un match",
            supported_sports=["football"]
        )
        self.client = AllSportsClient()

    def run(self, input_data: Any) -> Dict[str, Any]:
        match_id = input_data.get("match_id")
        sport = input_data.get("sport", "football")

        if not match_id:
            return {"error": "L'ID du match est obligatoire."}

        try:
            videos = self.client.get_videos(match_id)
            return {
                "type": "videos",
                "sport": sport,
                "match_id": match_id,
                "videos": videos
            }
        except Exception as e:
            return {"error": str(e)}
