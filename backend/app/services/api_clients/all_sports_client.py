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

    def get_leagues(self, country_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Récupère les ligues supportées."""
        params = {
            "met": "Leagues",
            "APIkey": self.api_key
        }
        if country_id:
            params["countryId"] = country_id
            
        try:
             response = httpx.get(self.base_url, params=params, timeout=10.0)
             response.raise_for_status()
             data = response.json()
             if data.get("success") == 1:
                 return data.get("result", [])
             return []
        except Exception as e:
            print(f"DEBUG: Error fetching leagues: {e}")
            return []

    def get_h2h(self, first_team_id: str, second_team_id: str) -> Dict[str, Any]:
        """Récupère les données H2H entre deux équipes."""
        params = {
            "met": "H2H",
            "APIkey": self.api_key,
            "firstTeamId": first_team_id,
            "secondTeamId": second_team_id
        }
        try:
            print(f"DEBUG: Calling H2H API with params: {params}")
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            if data.get("success") == 1:
                return data.get("result", {})
            return {}
        except Exception as e:
            print(f"DEBUG: Error in H2H: {e}")
            return {}

    def get_finished_matches(self, sport: str, team_name: Optional[str] = None, team_id: Optional[str] = None, date_from: Optional[date] = None, date_to: Optional[date] = None, league_id: Optional[str] = None, with_player_stats: bool = False) -> List[Dict[str, Any]]:
        # Note: 'sport' argument is currently ignored as we hardcode /football in base_url.
        
        # 1. Resolve Team ID if only name is provided
        if team_name and not team_id:
            team_id = self._get_team_id(team_name)
            if not team_id and not league_id:
                # If no team AND no league, we can't search effectively (or it's too broad)
                print(f"DEBUG: Could not resolve team_id for '{team_name}'")
                return []

        # 2. Defaults for dates if not provided
        if not date_from:
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
        if with_player_stats:
             params["withPlayerStats"] = 1

        try:
            print(f"DEBUG: Calling API {self.base_url} with params: {params}")
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            
            if response.status_code == 401:
                raise ValueError("Clé API invalide ou manquante.")
            
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("success") == 1:
                matches = data.get("result", [])
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

    def get_standings(self, league_id: str) -> Dict[str, Any]:
        """Récupère le classement d'une ligue."""
        params = {
            "met": "Standings",
            "APIkey": self.api_key,
            "leagueId": league_id
        }
        try:
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            if data.get("success") == 1:
                return data.get("result", {})
            return {}
        except Exception as e:
            print(f"DEBUG: Error fetching standings: {e}")
            return {}

    def get_topscorers(self, league_id: str) -> List[Dict[str, Any]]:
        """Récupère les meilleurs buteurs d'une ligue."""
        params = {
            "met": "Topscorers",
            "APIkey": self.api_key,
            "leagueId": league_id
        }
        try:
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            if data.get("success") == 1:
                return data.get("result", [])
            return []
        except Exception as e:
            print(f"DEBUG: Error fetching topscorers: {e}")
            return []

    def get_team_details(self, team_id: str) -> Optional[Dict[str, Any]]:
        """Récupère les détails d'une équipe (joueurs, logo, etc.)."""
        params = {
            "met": "Teams",
            "APIkey": self.api_key,
            "teamId": team_id
        }
        try:
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            if data.get("success") == 1 and data.get("result"):
                return data["result"][0]
            return None
        except Exception as e:
            print(f"DEBUG: Error fetching team details: {e}")
            return None

    def get_videos(self, match_id: str) -> List[Dict[str, Any]]:
        """Récupère les vidéos (highlights) d'un match."""
        params = {
            "met": "Videos",
            "APIkey": self.api_key,
            "eventId": match_id
        }
        try:
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            if data.get("success") == 1:
                return data.get("result", [])
            return []
        except Exception as e:
            print(f"DEBUG: Error fetching videos: {e}")
            return []

    def get_odds(self, match_id: str) -> Dict[str, Any]:
        """Récupère les cotes d'un match."""
        params = {
            "met": "Odds",
            "APIkey": self.api_key,
            "matchId": match_id
        }
        try:
            response = httpx.get(self.base_url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            if data.get("success") == 1:
                return data.get("result", {})
            return {}
        except Exception as e:
            print(f"DEBUG: Error fetching odds: {e}")
            return {}
