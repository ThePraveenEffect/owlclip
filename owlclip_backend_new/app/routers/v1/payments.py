from app.schemas.payments import PaymentCreate
import razorpay 
from fastapi import APIRouter, Request,Depends, HTTPException
from app.core.database import get_db
from app.utils.razorpay import client
from app.db.deps import get_current_user_id, get_current_user
from app.models.Payment import Payment
from app.models.User import User
from app.utils.razorpay import client
from app.utils.constants import tier_amount
from app.core.config import settings
from sqlalchemy import update, select
import json
import logging
from datetime import (
    datetime,
    timezone,
    timedelta
)


router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/create")
async def create_order(
   payment_data: PaymentCreate,
   user = Depends(get_current_user),
   user_id = Depends(get_current_user_id),
   db = Depends(get_db)
):

     logger.warning("order is creating..")

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
                "email": user.email,
                "tier": payment_data.tier
            }
        })


        credits = {
               "starter": 250,
               "creator": 1000,
               }

        # save it to database
        payment =   Payment(
            user_id=user_id,
            razorpay_order_id=order['id'],
            status=order['status'],
            amount=order['amount'],
            currency=order['currency'],
            notes=order['notes'],
            tier=payment_data.tier,
            credits_to_add=credits[payment_data.tier]
        )
        
        db.add(payment)
        await db.commit()

        # return order details to frontend
        
        return {
            "success": True,
            "payment": {
                "id": payment.id,
                "order_id": payment.razorpay_order_id,
                "notes": order['notes'],
                "amount": payment.amount,
                "currency": payment.currency,
                "status": payment.status,
            },

            "razorpay_key_id": settings.RAZORPAY_KEY_ID
        }


     except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
     


@router.post("/webhook") # razorpay will call this endpoint after payment is done or event triggered
async def payment_webhook(
    request: Request,
    db=Depends(get_db)
):

    logger.warning("webhook ping!")

    try:

        webhook_body = await request.body()

        logger.warning(dict(request.headers))
        webhook_signature = request.headers.get(
            "x-razorpay-signature"
         )


        logger.warning(
       f"signature={webhook_signature}")

        logger.warning(
            f"secret_loaded={bool(settings.RAZORPAY_WEBHOOK_SECRET)}"
        )

        logger.warning(
            webhook_body[:200]
        )

        try:
            client.utility.verify_webhook_signature(
                webhook_body,
                webhook_signature,
                settings.RAZORPAY_WEBHOOK_SECRET
            )

        except Exception:
            logger.error(f"Signature verification failed: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail="Invalid webhook signature"
            )
        
        payload = json.loads(
            webhook_body
        )

        event = payload.get(
            "event"
        )

        # Ignore events you don't process
        if event != "payment.captured":
            return {
                "success": True
            }

        payment_entity = (
            payload["payload"]
            ["payment"]
            ["entity"]
        )

        payment = await db.scalar(

            select(Payment)
            .where(
                Payment.razorpay_order_id
                ==
                payment_entity["order_id"]
            )
            .with_for_update()

        )

        if not payment:

            raise HTTPException(
                status_code=404,
                detail="Payment not found"
            )

        # Prevent duplicate credit grant
        if (
            payment.status
            ==
            "captured"
        ):

            return {
                "success": True
            }

        # Prevent reused payment
        if payment.razorpay_payment_id:

            return {
                "success": True
            }

        if (
            int(payment.amount)
            !=
            int(payment_entity["amount"])
        ):

            raise HTTPException(
                status_code=400,
                detail="Amount mismatch"
            )

        now = datetime.now(
            timezone.utc
        )

        payment.status = (
            "captured"
        )

        payment.razorpay_payment_id = (
            payment_entity["id"]
        )

        payment.processed_at = (
            now
        )

        user = await db.scalar(

            select(User)
            .where(
                User.id
                ==
                payment.user_id
            )
            .with_for_update()

        )

        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        current_expiry = (
            user.subscription_expires_at
        )

        if (
            current_expiry
            and
            current_expiry > now
        ):

            base = current_expiry

        else:

            base = now

        new_expiry = (
            base
            +
            timedelta(days=30)
        )

        stmt = (

            update(User)

            .where(
                User.id
                ==
                payment.user_id
            )

            .values(

                credits_remaining=
                User.credits_remaining
                +
                payment.credits_to_add,

                credits_expires_at=
                new_expiry,

                subscription_status=
                "active",

                subscription_expires_at=
                new_expiry
            )
        )

        await db.execute(
            stmt
        )

        await db.commit()

        return {

            "success": True,

            "message":
            "Payment processed"

        }

    except HTTPException:

        await db.rollback()

        raise

    except Exception as e:

        await db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )



@router.get("/verify")
async def verify_payment_ui(

    user=Depends(
        get_current_user
    )

):

    now = datetime.now(
        timezone.utc
    )

    subscription_active = (

        user.subscription_status
        ==
        "active"

        and

        user.subscription_expires_at

        and

        user.subscription_expires_at
        >
        now

    )

    return {

        "success": True,

        "payment_verified":
        subscription_active,

        "subscription_status":
        user.subscription_status,

        "expires_at":
        user.subscription_expires_at
    }
