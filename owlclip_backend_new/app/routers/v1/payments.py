from app.schemas.payments import PaymentCreate
import razorpay 
from fastapi import APIRouter, Request,Depends, HTTPException
from app.core.database import get_db
from app.utils.razorpay import client
from app.db.deps import get_current_user_id, get_current_user
from app.models.Payment import Payment
from app.utils.razorpay import client
from app.utils.constants import tier_amount
from app.core.config import settings


router = APIRouter()


@router.post("/create")
async def create_order(
   payment_data: PaymentCreate,
   user = Depends(get_current_user),
   user_id = Depends(get_current_user_id),
   db = Depends(get_db)
):



     try:
        amount = tier_amount.get(payment_data.tier, 0)
        
        if amount == 0:
            raise HTTPException(status_code=400, detail="Invalid tier selected.")
        
        order = client.order.create({
            "amount": amount *100,  # amount in paise
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                "username": user.username,
                "tier": payment_data.tier
            }
        })

        # save it to database
        payment = Payment(
            user_id=user_id,
            razorpay_order_id=order['id'],
            status=order['status'],
            amount=order['amount'],
            currency=order['currency'],
            notes=order['notes'],
            tier=payment_data.tier
        )
        
        db.add(payment)
        await db.commit()

        # return order details to frontend
        return payment

     except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
     


@router.post("/payment/webhook") # razorpay will call this endpoint after payment is done or event triggered
async def payment_webhook(request: Request):
   try:
        webhook_body = await request.body()
        
        webhook_signature = request.headers.get("X-Razorpay-Signature")

        is_webhook_valid =  client.utility.verify_webhook_signature(
            webhook_body, 
            webhook_signature, 
            settings.RAZORPAY_WEBHOOK_SECRET
        )
        
        if not is_webhook_valid:
            raise HTTPException(status_code=400, detail="Invalid webhook signature.")
        



   except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))