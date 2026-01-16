from typing import Any, Dict
from app.tools.base import BaseTool

class PerformanceTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="PerformanceTool",
            description="Analyse les performances d'une équipe ou d'un joueur.",
            supported_sports=["football", "basketball", "tennis"]
        )

    def run(self, input_data: Any) -> Dict[str, Any]:
        # Mock d'exécution
        return {
            "source": "PerformanceTool",
            "stats": {
                "goals": 2,
                "assists": 1,
                "rating": 8.5
            },
            "status": "success"
        }
