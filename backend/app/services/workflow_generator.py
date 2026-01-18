import uuid
from typing import List
from app.models.workflow import Workflow, WorkflowNode, WorkflowEdge
from app.services.tool_registry import tool_registry
from app.services.llm_service import llm_service

class WorkflowGenerator:
    def generate(self, sport: str, query: str) -> Workflow:
        """
        Génère un workflow basé sur la requête utilisateur.
        Ceci est une version simplifiée/mockée qui sélectionne des outils via des mots-clés.
        """
        nodes: List[WorkflowNode] = []
        edges: List[WorkflowEdge] = []
        
        # Logique de génération mockée basée sur des mots-clés
        # Analyse de la requête par LLM
        analysis = llm_service.analyze_query(query)
        tool_name = analysis.get("tool")
        parameters = analysis.get("parameters", {})
        
        y_pos = 0
        
        if tool_name:
            # Trouve l'outil correspondant dans le registre
            # Note: Le LLM retourne "match_info", mais le registre utilise peut-être des IDs différents
            # Dans notre cas, MatchInfoTool.name = "match_info", donc ça colle.
            
            tool = tool_registry.get_tool(tool_name)
            if tool:
                node_id = str(uuid.uuid4())
                nodes.append(WorkflowNode(
                    id=node_id,
                    tool_id=tool.name,
                    label=tool.name,
                    position={"x": 250, "y": y_pos},
                    data=parameters # Injection des paramètres extraits
                ))
        else:
             # Fallback ou gestion d'erreur si aucune intention trouvée
             # Pour l'instant, on ne fait rien ou on met un message
             pass

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
