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
        - match_info: pour les scores, résultats, détails d'un match terminé. Paramètres: sport (str), team (str), date (str YYYY-MM-DD, optionnel).
        
        Si la demande concerne un match, retourne un JSON avec :
        {
            "tool": "match_info",
            "parameters": {
                "sport": "football", // ou autre sport détecté
                "team": "Nom de l'équipe",
                "date": "YYYY-MM-DD" // ou null si non spécifié
            }
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
