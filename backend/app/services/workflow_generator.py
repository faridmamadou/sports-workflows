import uuid
from typing import List
from app.models.workflow import Workflow, WorkflowNode, WorkflowEdge
from app.services.tool_registry import tool_registry

class WorkflowGenerator:
    def generate(self, sport: str, query: str) -> Workflow:
        """
        Génère un workflow basé sur la requête utilisateur.
        Ceci est une version simplifiée/mockée qui sélectionne des outils via des mots-clés.
        """
        nodes: List[WorkflowNode] = []
        edges: List[WorkflowEdge] = []
        
        # Logique de génération mockée basée sur des mots-clés
        query_lower = query.lower()
        
        available_tools = tool_registry.list_tools()
        previous_node_id = None
        
        y_pos = 0
        
        for tool in available_tools:
            # Vérifie si l'outil supporte le sport demandé
            if sport in tool.supported_sports:
                keyword_match = False
                
                # Mapping simple mot-clé -> outil
                if tool.name == "NewsTool" and ("actualités" in query_lower or "news" in query_lower):
                    keyword_match = True
                elif tool.name == "TransfersTool" and ("transfert" in query_lower or "mercato" in query_lower):
                    keyword_match = True
                elif tool.name == "PerformanceTool" and ("stat" in query_lower or "performance" in query_lower or "résultat" in query_lower):
                    keyword_match = True
                
                if keyword_match:
                    node_id = str(uuid.uuid4())
                    nodes.append(WorkflowNode(
                        id=node_id,
                        tool_id=tool.id,
                        label=tool.name,
                        position={"x": 250, "y": y_pos}
                    ))
                    y_pos += 100
                    
                    if previous_node_id:
                        edges.append(WorkflowEdge(
                            id=str(uuid.uuid4()),
                            source=previous_node_id,
                            target=node_id
                        ))
                    previous_node_id = node_id

        # Si aucun outil n'est trouvé, on met un outil par défaut (ex: News)
        if not nodes:
             default_tool = tool_registry.get_tool("NewsTool")
             if default_tool:
                node_id = str(uuid.uuid4())
                nodes.append(WorkflowNode(
                     id=node_id,
                     tool_id=default_tool.name,
                     label=default_tool.name,
                     position={"x": 250, "y": 0}
                ))

        return Workflow(
            id=str(uuid.uuid4()),
            sport=sport,
            query=query,
            nodes=nodes,
            edges=edges
        )

workflow_generator = WorkflowGenerator()
