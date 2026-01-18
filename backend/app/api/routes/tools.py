from fastapi import APIRouter
from typing import List
from app.models.tool import ToolInfo
from app.services.tool_registry import tool_registry
from app.core.config import settings

router = APIRouter()

@router.get("/", response_model=List[ToolInfo])
def list_tools():
    """
    Liste tous les outils disponibles.
    """
    # return {"tools": tool_registry.list_tools(), "api_key": settings.ALL_SPORTS_API_KEY}
    return tool_registry.list_tools()
