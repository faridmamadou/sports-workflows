from typing import Dict, Any, List
from app.models.workflow import Workflow
from app.services.tool_registry import tool_registry

class WorkflowExecutor:
    async def execute(self, workflow: Workflow) -> Dict[str, Any]:
        """
        Exécute le workflow et retourne les résultats.
        """
        results = {}
        context = {} # Pour passer des données entre les étapes si besoin
        
        # Ordonnancement simple: on suit la liste des nodes (supposée ordonnée pour l'instant)
        # Idéalement, on ferait un tri topologique
        
        execution_log = []

        for node in workflow.nodes:
            tool = tool_registry.get_tool(node.tool_id)
            if tool:
                # Exécution de l'outil
                # On pourrait passer le contexte ou le résultat du node précédent ici
                # Fusionner les paramètres du nœud avec le contexte
                # Les paramètres du nœud (extraits par LLM) sont prioritaires pour ce nœud
                tool_input = context.copy()
                tool_input.update(node.data)
                
                tool_output = tool.run(tool_input)
                
                results[node.id] = tool_output
                execution_log.append({
                    "node_id": node.id,
                    "tool": tool.name,
                    "status": "success",
                    "output": tool_output
                })
                
                # Mise à jour du contexte global avec la sortie
                context.update(tool_output)
            else:
                execution_log.append({
                    "node_id": node.id,
                    "tool": node.tool_id,
                    "status": "error",
                    "message": "Tool not found"
                })

        return {
            "workflow_id": workflow.id,
            "results": results,
            "execution_log": execution_log
        }

workflow_executor = WorkflowExecutor()
