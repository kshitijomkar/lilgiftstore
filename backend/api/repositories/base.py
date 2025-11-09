"""Base repository with common database operations"""
from typing import List, Dict, Optional, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from api.utils.datetime_utils import serialize_document, deserialize_document


class BaseRepository:
    """Base repository class with common CRUD operations"""
    
    def __init__(self, db: AsyncIOMotorDatabase, collection_name: str):
        self.db = db
        self.collection = db[collection_name]
    
    async def create(self, document: Dict) -> Dict:
        """Create a new document"""
        doc = serialize_document(document)
        await self.collection.insert_one(doc)
        return deserialize_document(doc)
    
    async def find_by_id(self, doc_id: str) -> Optional[Dict]:
        """Find document by ID"""
        doc = await self.collection.find_one({"id": doc_id}, {"_id": 0})
        return deserialize_document(doc) if doc else None
    
    async def find_one(self, query: Dict, projection: Optional[Dict] = None) -> Optional[Dict]:
        """Find one document matching query"""
        projection = projection or {"_id": 0}
        doc = await self.collection.find_one(query, projection)
        return deserialize_document(doc) if doc else None
    
    async def find_many(self, query: Dict = None, limit: int = 100, skip: int = 0, 
                       sort: List[tuple] = None) -> List[Dict]:
        """Find multiple documents"""
        query = query or {}
        cursor = self.collection.find(query, {"_id": 0})
        
        if sort:
            for field, order in sort:
                cursor = cursor.sort(field, order)
        
        docs = await cursor.skip(skip).limit(limit).to_list(limit)
        return [deserialize_document(doc) for doc in docs]
    
    async def update(self, doc_id: str, update_data: Dict) -> bool:
        """Update a document by ID"""
        update_data = serialize_document(update_data)
        result = await self.collection.update_one(
            {"id": doc_id},
            {"$set": update_data}
        )
        return result.matched_count > 0
    
    async def update_one(self, query: Dict, update_data: Dict) -> bool:
        """Update one document matching query"""
        result = await self.collection.update_one(query, {"$set": update_data})
        return result.matched_count > 0
    
    async def delete(self, doc_id: str) -> bool:
        """Delete a document by ID"""
        result = await self.collection.delete_one({"id": doc_id})
        return result.deleted_count > 0
    
    async def delete_many(self, query: Dict) -> int:
        """Delete multiple documents"""
        result = await self.collection.delete_many(query)
        return result.deleted_count
    
    async def count(self, query: Dict = None) -> int:
        """Count documents matching query"""
        query = query or {}
        return await self.collection.count_documents(query)
    
    # Convenience method aliases for easier usage in routes
    async def get_by_id(self, doc_id: str) -> Optional[Dict]:
        """Alias for find_by_id"""
        return await self.find_by_id(doc_id)
    
    async def find(self, query: Dict = None, sort_field: str = "created_at",
                   sort_order: int = -1, skip: int = 0, limit: int = 100, 
                   exclude_password: bool = False) -> List[Dict]:
        """Find documents with simplified parameters"""
        sort = [(sort_field, sort_order)]
        docs = await self.find_many(query or {}, limit=limit, skip=skip, sort=sort)
        
        # Optionally exclude password field
        if exclude_password:
            for doc in docs:
                doc.pop("password", None)
        
        return docs
    
    async def get_by_ids(self, doc_ids: List[str]) -> List[Dict]:
        """Get multiple documents by IDs"""
        return await self.find_many({"id": {"$in": doc_ids}})
    
    async def aggregate(self, pipeline: List[Dict]) -> List[Dict]:
        """Execute aggregation pipeline"""
        cursor = self.collection.aggregate(pipeline)
        return await cursor.to_list(None)
