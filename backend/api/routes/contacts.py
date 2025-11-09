"""Contact Routes"""
from fastapi import APIRouter
from api.schemas import ContactRequest, ContactCreate
from api.config.database import db_manager
from api.utils.datetime_utils import serialize_document

router = APIRouter(prefix="/contact")


@router.post("", response_model=ContactRequest)
async def submit_contact(request: ContactCreate):
    """Submit contact form"""
    contact_obj = ContactRequest(**request.model_dump())
    doc = serialize_document(contact_obj.model_dump())
    await db_manager.db.contacts.insert_one(doc)
    return contact_obj

