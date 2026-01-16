from typing import Any, Dict
from app.tools.base import BaseTool

class TransfersTool(BaseTool):
    def __init__(self):
        super().__init__(
            name="TransfersTool",
            description="Récupère les informations sur les transferts (mercato).",
            supported_sports=["football"]
        )

    def run(self, input_data: Any) -> Dict[str, Any]:
        # Mock d'exécution
        return {
            "source": "TransfersTool",
            "transfers": [
                {"player": "Mbappé", "from": "PSG", "to": "Real Madrid", "status": "Confirmed"},
                {"player": "Kane", "from": "Tottenham", "to": "Bayern", "status": "Rumor"}
            ],
            "status": "success"
        }
