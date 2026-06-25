from sqlalchemy import select,update 
from sqlalchemy.exc import IntegrityError
from app.models.User import User
from datetime import datetime, timezone

async def get_user_by_email(db, email):
    result = await db.execute(
        select(User).where(
            (User.email == email)
        )
    )
    return result.scalar_one_or_none()

async def get_user_by_id(db, user_id):
    result = await db.execute(
        select(User).where(
            (User.id == user_id)
        )
    )
    return result.scalar_one_or_none()

async def get_user_by_username(db, username):
    result = await db.execute(
        select(User).where(
            (User.username == username)
        )
    )
    return result.scalar_one_or_none()

async def create_user(db, email:str, username:str, hashed_password:str):
    user = User(
        email=email,
        username=username,
        password_hash=hashed_password
    )
    
    db.add(user)
    
    try:
     await db.commit()
    except IntegrityError:
     await db.rollback()
     raise
        
    await db.refresh(user)
    return user


async def update_user_last_login(db, user_id):
    
    stmt = update(User).where(User.id == user_id).values(
        last_login=datetime.now(timezone.utc)
    )
    await db.execute(stmt)
    await db.commit()



async def deduct_credits(
    db,
    user_id,
    amount: int
) -> bool:

    result = await db.execute(
        update(User)
        .where(
            User.id == user_id,
            User.credits_remaining >= amount
        )
        .values(
            credits_remaining=User.credits_remaining - amount
        )
        .returning(User.credits_remaining)
    )

    remaining = result.scalar_one_or_none()

    return remaining is not None



async def refund_credits(
    db,
    user_id,
    amount: int
):
    await db.execute(
        update(User)
        .where(User.id == user_id)
        .values(
            credits_remaining=User.credits_remaining + amount
        )
    )