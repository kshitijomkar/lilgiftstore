"""
The Lil Gift Corner - Modular Backend API
FastAPI application with clean architecture
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Configuration
from api.config import settings
from api.config.database import db_manager

# Middleware
from api.middleware import error_handler_middleware, logging_middleware

# Routes (we'll import from the old server temporarily)
# In production, these would be fully modularized route files
from server import api_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting The Lil Gift Corner API...")
    await db_manager.connect()
    await db_manager.create_indexes()
    
    # Seed admin user
    from api.utils.auth import AuthUtils
    from api.schemas import User
    from api.utils.datetime_utils import serialize_document
    
    admin_exists = await db_manager.db.users.find_one({"email": settings.ADMIN_EMAIL})
    if not admin_exists:
        admin_user = User(
            name="Admin",
            email=settings.ADMIN_EMAIL,
            password=AuthUtils.get_password_hash(settings.ADMIN_PASSWORD),
            role="admin"
        )
        doc = serialize_document(admin_user.model_dump())
        await db_manager.db.users.insert_one(doc)
        logger.info("✅ Admin user created")
    
    logger.info("✅ Application started successfully")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down...")
    await db_manager.disconnect()


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Complete eCommerce API for handcrafted gifts and wedding favors",
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Add middleware
cors_origins = settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom middleware
error_handler_middleware(app)
logging_middleware(app)

# Include routers
app.include_router(api_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server_new:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )

