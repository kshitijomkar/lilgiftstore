"""Authentication service with business logic"""
from fastapi import HTTPException
from api.schemas import User, UserCreate, LoginRequest
from api.repositories import UserRepository
from api.utils.auth import AuthUtils
from api.utils.datetime_utils import serialize_document


class AuthService:
    """Authentication business logic"""
    
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo
    
    async def register(self, user_data: UserCreate) -> dict:
        """Register a new user"""
        # Check if email exists
        existing = await self.user_repo.find_by_email(user_data.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        user = User(
            name=user_data.name,
            email=user_data.email,
            password=AuthUtils.get_password_hash(user_data.password),
            role="customer"
        )
        
        # Save to database
        doc = serialize_document(user.model_dump())
        await self.user_repo.create(doc)
        
        # Generate token
        token = AuthUtils.create_access_token({
            "user_id": user.id,
            "email": user.email,
            "role": user.role
        })
        
        return {
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }
    
    async def login(self, login_data: LoginRequest) -> dict:
        """Authenticate user and return token"""
        # Find user
        user = await self.user_repo.find_by_email(login_data.email)
        if not user or not AuthUtils.verify_password(login_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Generate token
        token = AuthUtils.create_access_token({
            "user_id": user["id"],
            "email": user["email"],
            "role": user["role"]
        })
        
        return {
            "token": token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }
