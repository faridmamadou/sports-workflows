from abc import ABC, abstractmethod
from typing import Any, List, Dict

class BaseTool(ABC):
    def __init__(self, name: str, description: str, supported_sports: List[str]):
        self.name = name
        self.description = description
        self.supported_sports = supported_sports

    @abstractmethod
    def run(self, input_data: Any) -> Dict[str, Any]:
        """Exécute la logique de l'outil."""
        pass
