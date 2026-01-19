import json
from typing import Dict, Any
from openai import OpenAI
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
        self.model = "llama-3.3-70b-versatile" # Using a supported model

    def analyze_query(self, query: str) -> Dict[str, Any]:
        """
        Analyse une requête utilisateur pour extraire l'intention et les paramètres.
        Retourne un dictionnaire JSON.
        """
        system_prompt = """
        Tu es un assistant expert en sports. Ta tâche est d'analyser la demande de l'utilisateur pour extraire l'intention et les entités structurées pour une API de sports.
        
        Les outils disponibles sont :
        - match_info: pour les scores, résultats, détails d'un match terminé. 
        - standings: pour obtenir le classement d'une ligue (nécessite league ou league_id).
        - topscorers: pour obtenir les meilleurs buteurs d'une ligue (nécessite league ou league_id).
        - team_info: pour obtenir l'effectif et les détails d'une équipe (nécessite team ou team_id).
        - videos: pour obtenir les highlights d'un match (nécessite match_id).
        
        Paramètres possibles pour match_info:
        - sport (str): ex: "football".
        - team (str): Nom de l'équipe principale.
        - opponent (str): Nom de l'équipe adverse (pour les face-à-face).
        - league (str): Nom de la ligue/compétition (ex: "Premier League").
        - date (str YYYY-MM-DD): Date précise.
        - season (int): Année de la saison (ex: 2019).
        - details (list[str]): Liste de détails demandés (ex: ["stats", "lineups"]).
        
        Paramètres pour standings / topscorers:
        - league (str): Nom de la ligue.
        - league_id (str, optionnel).
        
        Paramètres pour team_info:
        - team (str): Nom de l'équipe.
        - team_id (str, optionnel).
        
        Paramètres pour videos:
        - match_id (str, obligatoire).
        
        Structure du JSON de réponse :
        {
            "tool": "name_of_tool",
            "parameters": { ... }
        }
        
        Si aucune intention claire ne correspond, retourne {"tool": null}.
        Réponds UNIQUEMENT le JSON.
        """

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"Erreur LLM: {e}")
            return {"tool": None}

llm_service = LLMService()
