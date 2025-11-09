"""Payment Routes"""
from fastapi import APIRouter, HTTPException, Request, Depends
import logging
import stripe
from api.repositories.cart_repository import CartRepository
from api.repositories.product_repository import ProductRepository
from api.repositories.order_repository import OrderRepository
from api.dependencies import get_cart_repository, get_product_repository, get_order_repository
from api.config.settings import settings

router = APIRouter(prefix="/checkout")
logger = logging.getLogger(__name__)

# Configure Stripe
stripe.api_key = settings.STRIPE_API_KEY


@router.post("/session")
async def create_checkout_session(
    request: Request,
    cart_repo: CartRepository = Depends(get_cart_repository),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """Create Stripe checkout session"""
    body = await request.json()
    
    session_id = body.get("session_id")
    origin_url = body.get("origin_url")
    
    if not session_id or not origin_url:
        raise HTTPException(
            status_code=400,
            detail="session_id and origin_url are required"
        )
    
    # Get cart items
    cart_items = await cart_repo.get_by_session(session_id)
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Build line items for Stripe
    line_items = []
    total_amount = 0.0
    
    for item in cart_items:
        product = await product_repo.get_by_id(item["product_id"])
        if product:
            # Stripe expects amount in cents
            unit_amount = int(product["price"] * 100)  # Convert to cents
            total_amount += product["price"] * item["quantity"]
            
            line_items.append({
                "price_data": {
                    "currency": "inr",
                    "unit_amount": unit_amount,
                    "product_data": {
                        "name": product["name"],
                        "description": product.get("description", "")[:500],  # Stripe limit
                    },
                },
                "quantity": item["quantity"],
            })
    
    # Setup URLs
    success_url = f"{origin_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin_url}/checkout/cancel"
    
    try:
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"session_id": session_id, "amount": str(total_amount)}
        )
        
        # Store transaction
        from api.config.database import db_manager
        from api.schemas.payment import PaymentTransaction
        from api.utils.datetime_utils import serialize_document
        
        payment_transaction = PaymentTransaction(
            checkout_session_id=checkout_session.id,
            amount=total_amount,
            currency="inr",
            metadata={"session_id": session_id},
            payment_status="pending",
            status="initiated"
        )
        
        doc = serialize_document(payment_transaction.model_dump())
        await db_manager.db.payment_transactions.insert_one(doc)
        
        return {
            "url": checkout_session.url,
            "session_id": checkout_session.id
        }
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Stripe error: {str(e)}")


@router.get("/status/{checkout_session_id}")
async def get_checkout_status(
    checkout_session_id: str,
    cart_repo: CartRepository = Depends(get_cart_repository),
    product_repo: ProductRepository = Depends(get_product_repository),
    order_repo: OrderRepository = Depends(get_order_repository)
):
    """Check payment status"""
    from api.config.database import db_manager
    
    transaction = await db_manager.db.payment_transactions.find_one(
        {"checkout_session_id": checkout_session_id},
        {"_id": 0}
    )
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # If already paid, return cached result
    if transaction.get("payment_status") == "paid":
        return {
            "status": transaction.get("status"),
            "payment_status": transaction.get("payment_status"),
            "order_id": transaction.get("order_id")
        }
    
    try:
        # Check with Stripe
        checkout_session = stripe.checkout.Session.retrieve(checkout_session_id)
        
        from datetime import datetime, timezone
        from api.utils.datetime_utils import serialize_document
        
        payment_status = checkout_session.payment_status  # 'paid', 'unpaid', 'no_payment_required'
        status = checkout_session.status  # 'complete', 'expired', 'open'
        
        update_data = {
            "status": status,
            "payment_status": payment_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # If paid, create order
        if payment_status == "paid" and transaction.get("payment_status") != "paid":
            session_id = transaction["metadata"]["session_id"]
            
            cart_items = await cart_repo.get_by_session(session_id)
            order_items = []
            user_id = None
            
            for item in cart_items:
                # Extract user_id from first cart item if available
                if not user_id and item.get("user_id"):
                    user_id = item["user_id"]
                
                product = await product_repo.get_by_id(item["product_id"])
                if product:
                    order_items.append({
                        "product_id": product["id"],
                        "name": product["name"],
                        "price": product["price"],
                        "quantity": item["quantity"]
                    })
            
            order = await order_repo.create({
                "session_id": session_id,
                "user_id": user_id,
                "items": order_items,
                "total_amount": transaction["amount"],
                "status": "completed"
            })
            
            update_data["order_id"] = order["id"]
            
            # Clear cart
            await cart_repo.clear_session(session_id)
        
        await db_manager.db.payment_transactions.update_one(
            {"checkout_session_id": checkout_session_id},
            {"$set": update_data}
        )
        
        return {
            "status": status,
            "payment_status": payment_status,
            "order_id": update_data.get("order_id")
        }
    except stripe.error.StripeError as e:
        logger.error(f"Error checking payment status: {str(e)}")
        raise HTTPException(status_code=500, detail="Error checking payment status")
    except Exception as e:
        logger.error(f"Error checking payment status: {str(e)}")
        raise HTTPException(status_code=500, detail="Error checking payment status")


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    # Note: Webhook verification requires webhook secret from Stripe dashboard
    # For development, you can skip verification or set STRIPE_WEBHOOK_SECRET in .env
    
    try:
        event = stripe.Event.construct_from(
            stripe.util.convert_to_dict(stripe.api_decode(body)),
            stripe.api_key
        )
        
        logger.info(f"Webhook received: {event.type}")
        
        # Handle different event types
        if event.type == 'checkout.session.completed':
            session = event.data.object
            logger.info(f"Payment successful for session: {session.id}")
            # Payment processing is handled in get_checkout_status endpoint
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook error")
