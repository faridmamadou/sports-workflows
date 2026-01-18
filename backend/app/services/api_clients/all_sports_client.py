from typing import Any, Dict, List, Optional
import httpx
from datetime import date, timedelta
from app.core.config import settings

class AllSportsClient:
    def __init__(self):
        self.api_key = settings.ALL_SPORTS_API_KEY
        self.base_url = "https://apiv2.allsportsapi.com/football/" 

    def _get_team_id(self, team_name: str) -> Optional[str]:
        """Récupère l'ID d'une équipe par son nom."""
        params = {
            "met": "Teams",
            "teamName": team_name,
            "APIkey": self.api_key
        }
        try:
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            if data.get("success") == 1 and data.get("result"):
                # On prend le premier résultat
                team_key = data["result"][0]["team_key"]
                print(f"DEBUG: Found team_id for '{team_name}': {team_key}")
                return team_key
            print(f"DEBUG: No team found for '{team_name}'. Data: {data}")
            return None
        except Exception as e:
            print(f"DEBUG: Exception in _get_team_id: {e}")
            return None

    def get_finished_matches(self, sport: str, team_name: Optional[str] = None, team_id: Optional[str] = None, date_from: Optional[date] = None, date_to: Optional[date] = None, league_id: Optional[str] = None) -> List[Dict[str, Any]]:
        # Note: 'sport' argument is currently ignored as we hardcode /football in base_url based on provided docs.
        # If we support other sports, we'd need to change the base_url dynamically.
        
        # 1. Resolve Team ID if only name is provided
        if team_name and not team_id:
            team_id = self._get_team_id(team_name)
            if not team_id:
                # Si on ne trouve pas l'équipe, on ne peut pas filtrer par équipe
                # On pourrait retourner vide ou lever une erreur.
                # Pour l'instant, on retourne vide car la recherche était spécifique.
                print(f"DEBUG: Could not resolve team_id for '{team_name}'")
                return []

        # 2. Defaults for dates if not provided
        # L'API Fixtures nécessite 'from' et 'to'.
        if not date_from:
            # Par défaut, on regarde les 30 derniers jours si pas de date
            date_from = date.today() - timedelta(days=30)
        if not date_to:
            date_to = date.today()

        params = {
            "met": "Fixtures",
            "APIkey": self.api_key,
            "from": date_from.isoformat(),
            "to": date_to.isoformat()
        }

        if team_id:
            params["teamId"] = team_id
        if league_id:
            params["leagueId"] = league_id

        try:
            print(f"DEBUG: Calling API {self.base_url} with params: {params}")
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            
            if response.status_code == 401:
                raise ValueError("Clé API invalide ou manquante.")
            
            response.raise_for_status()
            
            data = response.json()
            # print(f"DEBUG: Raw API response: {json.dumps(data, default=str)[:500]}...") # Commented out to reduce noise
            
            # L'API retourne { "success": 1, "result": [...] }
            if data.get("success") == 1:
                matches = data.get("result", [])
                # Filtrer status 'Finished' côté client si l'API ne le fait pas via params (doc ne mentionne pas status param pour Fixtures)
                # La doc montre 'event_status': 'Finished' dans la réponse
                finished_matches = [m for m in matches if m.get("event_status") == "Finished"]
                print(f"DEBUG: Found {len(matches)} matches, {len(finished_matches)} finished.")
                return finished_matches
            
            print(f"DEBUG: API returned success!=1 or no result. Data: {data}")
            return []

        except httpx.RequestError as e:
            raise RuntimeError(f"API indisponible: {str(e)}")
        except httpx.HTTPStatusError as e:
             raise RuntimeError(f"Erreur HTTP {e.response.status_code}: {e.response.text}")
        except Exception as e:
            raise RuntimeError(f"Erreur inattendue: {str(e)}")

