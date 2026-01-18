from datetime import date
from typing import Optional
from pydantic import BaseModel

class MatchInfo(BaseModel):
    match_id: str
    sport: str
    league: Optional[str] = None
    home_team: str
    away_team: str
    home_score: int
    away_score: int
    match_date: date
    status: str
