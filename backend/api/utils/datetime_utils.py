"""Date and time utility functions"""
from datetime import datetime
from typing import Any, Dict, List


def serialize_datetime(dt: datetime) -> str:
    """Convert datetime to ISO format string"""
    if isinstance(dt, datetime):
        return dt.isoformat()
    return dt


def deserialize_datetime(dt_str: str) -> datetime:
    """Convert ISO format string to datetime"""
    if isinstance(dt_str, str):
        return datetime.fromisoformat(dt_str)
    return dt_str


def serialize_document(doc: Dict) -> Dict:
    """Serialize a document for database storage"""
    serialized = doc.copy()
    for key, value in serialized.items():
        if isinstance(value, datetime):
            serialized[key] = serialize_datetime(value)
    return serialized


def deserialize_document(doc: Dict) -> Dict:
    """Deserialize a document from database"""
    deserialized = doc.copy()
    for key, value in deserialized.items():
        if isinstance(value, str) and 'created_at' in key or 'updated_at' in key:
            try:
                deserialized[key] = deserialize_datetime(value)
            except (ValueError, TypeError):
                pass
    return deserialized


def serialize_documents(docs: List[Dict]) -> List[Dict]:
    """Serialize a list of documents"""
    return [serialize_document(doc) for doc in docs]


def deserialize_documents(docs: List[Dict]) -> List[Dict]:
    """Deserialize a list of documents"""
    return [deserialize_document(doc) for doc in docs]

