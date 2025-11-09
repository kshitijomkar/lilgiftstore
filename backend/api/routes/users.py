"""User Profile Routes"""
from fastapi import APIRouter, HTTPException, Depends
from api.schemas import UserUpdate, AddressCreate, Address
from api.repositories.user_repository import UserRepository
from api.repositories.order_repository import OrderRepository
from api.dependencies import (
    get_user_repository,
    get_order_repository,
    get_current_user
)
from api.config.database import db_manager
from api.utils.datetime_utils import serialize_document

router = APIRouter(prefix="/user")


@router.get("/profile")
async def get_profile(
    user: dict = Depends(get_current_user)
):
    """Get user profile"""
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "phone": user.get("phone"),
        "created_at": user.get("created_at")
    }


@router.put("/profile")
async def update_profile(
    update_data: UserUpdate,
    user: dict = Depends(get_current_user),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Update user profile"""
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        raise HTTPException(400, "No fields to update")
    
    success = await user_repo.update(user["id"], update_dict)
    if not success:
        raise HTTPException(404, "User not found")
    
    return {"message": "Profile updated successfully"}


@router.get("/orders")
async def get_user_orders(
    user: dict = Depends(get_current_user),
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Get user's orders"""
    orders = await order_repo.get_user_orders(user["id"])
    return {"orders": orders}


@router.post("/addresses")
async def create_address(
    address_data: AddressCreate,
    user: dict = Depends(get_current_user)
):
    """Create new address"""
    # If this is default, unset other defaults
    if address_data.is_default:
        await db_manager.db.addresses.update_many(
            {"user_id": user["id"]},
            {"$set": {"is_default": False}}
        )
    
    address = Address(user_id=user["id"], **address_data.model_dump())
    doc = serialize_document(address.model_dump())
    await db_manager.db.addresses.insert_one(doc)
    
    return address


@router.get("/addresses")
async def get_addresses(
    user: dict = Depends(get_current_user)
):
    """Get user addresses"""
    from api.utils.datetime_utils import deserialize_documents
    
    addresses = await db_manager.db.addresses.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).to_list(100)
    
    addresses = deserialize_documents(addresses)
    return {"addresses": addresses}


@router.put("/addresses/{address_id}")
async def update_address(
    address_id: str,
    address_data: AddressCreate,
    user: dict = Depends(get_current_user)
):
    """Update address"""
    # If setting as default, unset others
    if address_data.is_default:
        await db_manager.db.addresses.update_many(
            {"user_id": user["id"], "id": {"$ne": address_id}},
            {"$set": {"is_default": False}}
        )
    
    result = await db_manager.db.addresses.update_one(
        {"id": address_id, "user_id": user["id"]},
        {"$set": address_data.model_dump()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(404, "Address not found")
    
    return {"message": "Address updated successfully"}


@router.delete("/addresses/{address_id}")
async def delete_address(
    address_id: str,
    user: dict = Depends(get_current_user)
):
    """Delete address"""
    result = await db_manager.db.addresses.delete_one(
        {"id": address_id, "user_id": user["id"]}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(404, "Address not found")
    
    return {"message": "Address deleted successfully"}

