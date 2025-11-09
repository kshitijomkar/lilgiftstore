"""
Application Configuration Settings
Centralized configuration management with environment variables
"""
import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / '.env')


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "The Lil Gift Corner API"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = False
    
    # Database
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "lilgiftcorner_db")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")
    
    # Stripe Payment
    STRIPE_API_KEY: str = os.getenv("STRIPE_API_KEY", "your_stripe_key")
    
    # Admin Credentials (for initial setup)
    ADMIN_EMAIL: str = "admin@thelilgiftcorner.com"
    ADMIN_PASSWORD: str = "Admin@123"  # Should be changed in production
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Stock Management
    DEFAULT_STOCK_QUANTITY: int = 100
    DEFAULT_LOW_STOCK_THRESHOLD: int = 10
    
    class Config:
        case_sensitive = True
        env_file = ".env"


# Global settings instance
settings = Settings()

