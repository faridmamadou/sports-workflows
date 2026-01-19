import sys
import os
import json
from datetime import date

# Robustly add backend to path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(current_dir, 'backend')
if os.path.exists(backend_path):
    sys.path.append(backend_path)
else:
    # Fallback if running inside backend or script moved
    sys.path.append(current_dir)

from app.tools.match_info_tool import MatchInfoTool
from app.core.config import settings

def verify_match_tool_real():
    print("Verifying MatchInfoTool with REAL API KEY...")
    
    if not settings.ALL_SPORTS_API_KEY or "replace_this" in settings.ALL_SPORTS_API_KEY:
        print("WARNING: ALL_SPORTS_API_KEY seems to be a placeholder or empty.")
        print("Please check your .env file.")
    else:
        print(f"Using API Key: {settings.ALL_SPORTS_API_KEY[:5]}... (masked)")

    tool = MatchInfoTool()
    
    # NO MOCKING HERE - attempting real call
    
    input_data = {
        "sport": "football",
        "team": "Chelsea", # Using a major team likely to have recent matches
        # "date": "2024-01-10" # Optional: let's try without date to get recent matches or specific if API requires
    }
    
    print(f"Running tool with input: {input_data}")
    try:
        result = tool.run(input_data)
        print("\n--- Tool Output ---")
        print(json.dumps(result, indent=2, default=str))
        print("-------------------\n")
        
        if "error" in result:
             print("Tool returned an error. Check API Key and Quota.")
        else:
             print(f"Success! Found {len(result.get('matches', []))} matches.")

    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    verify_match_tool_real()
