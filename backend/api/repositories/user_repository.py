"""User repository for database operations"""
from typing import Optional, Dict
from .base import BaseRepository


class UserRepository(BaseRepository):
    """Repository for user operations"""
    
    def __init__(self, db):
        super().__init__(db, "users")
    
    async def find_by_email(self, email: str) -> Optional[Dict]:
        """Find user by email"""
        return await self.find_one({"email": email})
    
    async def get_users_by_role(self, role: str) -> list:
        """Get all users with specific role"""
        return await self.find_many({"role": role})

