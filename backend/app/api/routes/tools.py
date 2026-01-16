from fastapi import APIRouter
from typing import List
from app.models.tool import ToolInfo
from app.services.tool_registry import tool_registry

router = APIRouter()

@router.get("/", response_model=List[ToolInfo])
def list_tools():
    """
    Liste tous les outils disponibles.
    """
    return tool_registry.list_tools()
