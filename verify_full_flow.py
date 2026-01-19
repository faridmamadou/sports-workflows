import sys
import os
import json
import asyncio

# Add backend to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(current_dir, 'backend')
if os.path.exists(backend_path):
    sys.path.append(backend_path)
else:
    sys.path.append(current_dir)

from app.services.workflow_generator import workflow_generator
from app.services.workflow_executor import workflow_executor
from app.core.config import settings

async def verify_full_flow():
    print("Verifying Full Flow: Query -> LLM -> Tool -> API")
    print(f"API Key present: {'Yes' if settings.ALL_SPORTS_API_KEY and 'replace' not in settings.ALL_SPORTS_API_KEY else 'NO'}")
    
    # query = "Score du match de Chelsea"
    query = "Résultat de Chelsea"
    print(f"\nQUERY: '{query}'")
    
    # 1. GENERATION
    print("--- 1. Generating Workflow (LLM)... ---")
    try:
        workflow = workflow_generator.generate(sport="football", query=query)
        if not workflow.nodes:
            print("❌ Failed to generate nodes.")
            return
            
        node = workflow.nodes[0]
        print(f"✅ Workflow Generated. Node Tool: {node.tool_id}")
        print(f"✅ Extracted Params: {node.data}")
    except Exception as e:
         print(f"❌ Generation Error: {e}")
         return

    # 2. EXECUTION
    print("\n--- 2. Executing Workflow (Real API)... ---")
    try:
        result = await workflow_executor.execute(workflow)
        
        node_result = result["results"][node.id]
        print("\n--- Tool Execution Result ---")
        print(json.dumps(node_result, indent=2, default=str))
        print("-----------------------------\n")
        
        matches = node_result.get("matches", [])
        if matches:
            print(f"✅ SUCCESS! Found {len(matches)} matches from API.")
            print(f"First match: {matches[0]['home_team']} {matches[0]['home_score']} - {matches[0]['away_score']} {matches[0]['away_team']}")
        else:
             print("⚠️ No matches found (but API call might have worked).")
             
    except Exception as e:
        print(f"❌ Execution Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_full_flow())
