"""Authentication Routes"""
from fastapi import APIRouter, HTTPException, Depends
from api.schemas import UserCreate, LoginRequest
from api.utils.auth import AuthUtils
from api.repositories.user_repository import UserRepository
from api.dependencies import get_user_repository

router = APIRouter(prefix="/auth")


@router.post("/register")
async def register(
    user_data: UserCreate,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Register a new user"""
    # Check if user exists
    existing = await user_repo.find_by_email(user_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user with hashed password
    hashed_password = AuthUtils.get_password_hash(user_data.password)
    from api.schemas import User
    user_obj = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role="customer"
    )
    user = await user_repo.create(user_obj.model_dump())
    
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


@router.post("/login")
async def login(
    login_data: LoginRequest,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Login user"""
    user = await user_repo.find_by_email(login_data.email)
    
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

