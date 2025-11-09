"""Custom Gift Routes"""
from fastapi import APIRouter, HTTPException
from api.schemas import CustomGiftRequest, CustomGiftCreate
from api.config.database import db_manager
from api.utils.datetime_utils import serialize_document

router = APIRouter(prefix="/custom-gifts")


@router.post("", response_model=CustomGiftRequest)
async def submit_custom_gift(request: CustomGiftCreate):
    """Submit custom gift request"""
    gift_obj = CustomGiftRequest(**request.model_dump())
    doc = serialize_document(gift_obj.model_dump())
    await db_manager.db.custom_gifts.insert_one(doc)
    return gift_obj
