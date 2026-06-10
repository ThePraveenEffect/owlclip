from fastapi import Request
from slowapi import Limiter 


def get_user_identifier(request:Request) -> str:
    """
    Extract unique key from the request.
    Fallback to ip address if the user is unauthenticated.
    """

    if hasattr(request.state , "user_id"):
        return f"user:{request.state.user_id}"
    
    return request.client.host if request.client else "127.0.0.1"


# Initialize your limiter with the custom tracking logic
limiter = Limiter(key_func = get_user_identifier)  