import sys
import os
import json
from app.services.workflow_generator import workflow_generator
from app.core.config import settings

# Add backend to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(current_dir, 'backend')
if os.path.exists(backend_path):
    sys.path.append(backend_path)
else:
    sys.path.append(current_dir)


def verify_llm():
    print("Verifying LLM-based Workflow Generation...")
    
    if not settings.GROQ_API_KEY:
        print("ERROR: GROQ_API_KEY is missing.")
        return

    queries = [
        "Score du match du PSG",
        "Résultat de Chelsea vs Liverpool",
        "Donne moi le score de Real Madrid le 2023-10-28"
    ]
    
    for q in queries:
        print(f"\nQuery: '{q}'")
        try:
            workflow = workflow_generator.generate(sport="football", query=q)
            print(f"Workflow ID: {workflow.id}")
            if workflow.nodes:
                node = workflow.nodes[0]
                print(f"Node Tool: {node.tool_id}")
                print(f"Extracted Params (Node Data): {node.data}")
                
                # Basic checks
                if "team" in node.data:
                    print(f"✅ Extracted Team: {node.data['team']}")
                else:
                    print("❌ Team NOT extracted")
                    
                if "date" in node.data and node.data['date']:
                    print(f"✅ Extracted Date: {node.data['date']}")
                
            else:
                print("❌ No nodes generated (Intent not recognized?)")
                
        except Exception as e:
            print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    verify_llm()
