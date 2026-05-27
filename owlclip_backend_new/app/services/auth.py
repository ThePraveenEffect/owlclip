from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from starlette import status
from app.repositories.users import (
    get_user_by_email,
    get_user_by_username,
    create_user,
    update_user_last_login
)

from app.utils.AppError import AppException
from app.core.validators import validate_username, validate_password
from app.core.security import(
    hash_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password
)


async def signup_service(db,user):
    email = user.email.strip().lower()
    username = validate_username(user.username)
    password = validate_password(user.password)
    
    # print(validate_username, validate_password)
    
    
    existing_user = await get_user_by_email(db, email)
    if existing_user:
        raise AppException(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="EMAIL_ALREADY_REGISTERED",
            message="Registration blocked.",
            issues=[{
                "field": "email",
                "message": "This email address is already registered."
            }]
        )

    existing_username = await get_user_by_username(db, username)
    if existing_username:
        raise AppException(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="USERNAME_TAKEN",
            message="Registration blocked.",
            issues=[{
                "field": "username",
                "message": "This username is already taken. Please try another one."
            }]
        )

   

    hashed_password = hash_password(password)

    try:
        new_user = await create_user(db, email, username, hashed_password)
    except IntegrityError:
        raise HTTPException(
            status_code=400,
            detail={"general": "Conflict occurred, try different credentials"}
        )



    return new_user
    


async def login_service(db, data):
    email = data.email.strip().lower()
    password = data.password
    
    user = await get_user_by_email(db, email)
   

    is_valid =  verify_password(password, user.password_hash)



    
    if not user or not is_valid :
        raise AppException(
            status_code=status.HTTP_400_BAD_REQUEST,
            code="INVALID_CREDENTIALS",
            message="Authentication failed.",
            issues=[{
                "field": "email",
                "message": "Invalid Credentials. Please check your email and password."
            }]
        )
    
    
    # Update last login timestamp
    await update_user_last_login(db, user.id)
    
    access_token = create_access_token({"user_id": str(user.id)})
    refresh_token = create_refresh_token({"user_id": str(user.id)})
    
    return {
        "user": {
            "id": str(user.id),
            "username": user.username,
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
