from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ToolModel(BaseModel):
    id: str
    name: str
    description: str
    supported_sports: List[str]

class WorkflowNode(BaseModel):
    id: str
    tool_id: str
    label: str
    position: Dict[str, float] = Field(default_factory=lambda: {"x": 0, "y": 0})
    data: Dict[str, Any] = Field(default_factory=dict)

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str

class Workflow(BaseModel):
    id: str
    sport: str
    query: str
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]

class WorkflowCreate(BaseModel):
    sport: str
    query: str

class WorkflowExecute(BaseModel):
    workflow: Workflow
