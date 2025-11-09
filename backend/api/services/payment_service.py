"""Payment service for Stripe integration"""
from typing import Dict
from fastapi import HTTPException
import stripe
from api.config import settings
from api.repositories import OrderRepository, CartRepository
from api.schemas import PaymentTransaction, Order
from api.utils.datetime_utils import serialize_document
from datetime import datetime, timezone


class PaymentService:
    """Payment processing business logic"""
    
    def __init__(self, cart_repo: CartRepository, order_repo: OrderRepository, db):
        self.cart_repo = cart_repo
        self.order_repo = order_repo
        self.db = db
        stripe.api_key = settings.STRIPE_API_KEY
    
    async def create_checkout_session(self, session_id: str, origin_url: str) -> Dict:
        """Create Stripe checkout session"""
        # Get cart items
        cart_items = await self.cart_repo.find_by_session(session_id)
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Build line items for Stripe
        line_items = []
        total_amount = 0.0
        
        for item in cart_items:
            product = await self.db.products.find_one({"id": item["product_id"]}, {"_id": 0})
            if product:
                # Stripe expects amount in cents
                unit_amount = int(product["price"] * 100)
                total_amount += product["price"] * item["quantity"]
                
                line_items.append({
                    "price_data": {
                        "currency": "inr",
                        "unit_amount": unit_amount,
                        "product_data": {
                            "name": product["name"],
                            "description": product.get("description", "")[:500],
                        },
                    },
                    "quantity": item["quantity"],
                })
        
        # Create checkout session
        success_url = f"{origin_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{origin_url}/checkout/cancel"
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"session_id": session_id, "amount": str(total_amount)}
        )
        
        # Save transaction
        transaction = PaymentTransaction(
            checkout_session_id=checkout_session.id,
            amount=total_amount,
            currency="inr",
            metadata={"session_id": session_id},
            payment_status="pending",
            status="initiated"
        )
        
        doc = serialize_document(transaction.model_dump())
        await self.db.payment_transactions.insert_one(doc)
        
        return {"url": checkout_session.url, "session_id": checkout_session.id}
    
    async def check_payment_status(self, checkout_session_id: str) -> Dict:
        """Check payment status and create order if paid"""
        transaction = await self.db.payment_transactions.find_one(
            {"checkout_session_id": checkout_session_id},
            {"_id": 0}
        )
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        # If already paid, return cached status
        if transaction.get("payment_status") == "paid":
            return {
                "status": transaction.get("status"),
                "payment_status": transaction.get("payment_status"),
                "order_id": transaction.get("order_id")
            }
        
        # Check with Stripe
        checkout_session = stripe.checkout.Session.retrieve(checkout_session_id)
        
        payment_status = checkout_session.payment_status
        status = checkout_session.status
        
        update_data = {
            "status": status,
            "payment_status": payment_status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Create order if payment successful
        if payment_status == "paid" and transaction.get("payment_status") != "paid":
            session_id = transaction["metadata"]["session_id"]
            
            # Get cart items and create order
            cart_items = await self.cart_repo.find_by_session(session_id)
            order_items = []
            
            for item in cart_items:
                product = await self.db.products.find_one({"id": item["product_id"]}, {"_id": 0})
                if product:
                    order_items.append({
                        "product_id": product["id"],
                        "name": product["name"],
                        "price": product["price"],
                        "quantity": item["quantity"]
                    })
            
            order = Order(
                session_id=session_id,
                items=order_items,
                total_amount=transaction["amount"],
                status="completed"
            )
            
            order_doc = serialize_document(order.model_dump())
            await self.db.orders.insert_one(order_doc)
            
            update_data["order_id"] = order.id
            
            # Clear cart
            await self.cart_repo.clear_session_cart(session_id)
        
        # Update transaction
        await self.db.payment_transactions.update_one(
            {"checkout_session_id": checkout_session_id},
            {"$set": update_data}
        )
        
        return {
            "status": status,
            "payment_status": payment_status,
            "order_id": update_data.get("order_id")
        }
