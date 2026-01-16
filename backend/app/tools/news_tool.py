from typing import Any, Dict
from app.tools.base import BaseTool

class NewsTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="NewsTool",
            description="Récupère les dernières actualités sportives.",
            supported_sports=["football", "basketball", "tennis", "rugby"]
        )

    def run(self, input_data: Any) -> Dict[str, Any]:
        # Mock d'exécution
        return {
            "source": "NewsTool",
            "articles": [
                {"title": "Le PSG prépare un gros transfert", "url": "https://example.com/psg-mercato"},
                {"title": "Résultats de la NBA cette nuit", "url": "https://example.com/nba-results"}
            ],
            "status": "success"
        }
