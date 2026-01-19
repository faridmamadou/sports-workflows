from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sports Workflow API"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173", # Frontend Vite
        "http://localhost:3000",
        "https://sports-workflows.vercel.app/"
    ]
    ALL_SPORTS_API_KEY: str
    GROQ_API_KEY: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
