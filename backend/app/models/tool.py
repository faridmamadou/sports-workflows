from pydantic import BaseModel
from typing import List

class ToolInfo(BaseModel):
    id: str
    name: str
    description: str
    supported_sports: List[str]
