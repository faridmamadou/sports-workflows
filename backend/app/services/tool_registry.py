from typing import Dict, List, Optional
from app.tools.base import BaseTool
from app.tools.news_tool import NewsTool
from app.tools.transfers_tool import TransfersTool
from app.tools.performance_tool import PerformanceTool
from app.models.tool import ToolInfo

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}
        self._register_default_tools()

    def _register_default_tools(self):
        self.register_tool(NewsTool())
        self.register_tool(TransfersTool())
        self.register_tool(PerformanceTool())

    def register_tool(self, tool: BaseTool):
        self._tools[tool.name] = tool

    def get_tool(self, tool_name: str) -> Optional[BaseTool]:
        return self._tools.get(tool_name)

    def list_tools(self) -> List[ToolInfo]:
        return [
            ToolInfo(
                id=tool.name,
                name=tool.name,
                description=tool.description,
                supported_sports=tool.supported_sports
            )
            for tool in self._tools.values()
        ]

tool_registry = ToolRegistry()
