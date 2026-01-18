from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.core.config import settings
from app.core.cors import setup_cors
from app.api.routes import workflows, tools

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Setup CORS
setup_cors(app)

# Include Routers
app.include_router(workflows.router, prefix="/workflows", tags=["Workflows"])
app.include_router(tools.router, prefix="/tools", tags=["Tools"])

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "0.1.0"}

if __name__ == "__main__":
    import uvicorn
    print(f"DEBUG: La clé est: {settings.ALL_SPORTS_API_KEY}", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=8000)
