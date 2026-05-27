import re
from fastapi import HTTPException


USERNAME_REGEX = re.compile(
    r"^(?!_)(?!.*__)[a-zA-Z0-9_]{3,20}(?<!_)$"
)

SPECIAL_CHARS= set("!@#$%^&*()-_=+[]{}|;:,.<>?/")

def validate_username (username:str):
   username = username.strip()
   if not USERNAME_REGEX.match(username):
      raise ValueError(
         "Username must be 3-20 chars, letters/numbers/underscore, "
            "no leading/trailing or double underscores"
      )
   return username


def validate_password(password: str) -> str:
    password = password.strip()

    # Length (allow passphrases up to 128)
    if not (8 <= len(password) <= 128):
        raise ValueError("Password must be 8–128 characters long")

    # Character class checks
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_symbol = any(c in SPECIAL_CHARS for c in password)

    # Require at least 3 of 4 classes (flexible but strong)
    classes = sum([has_lower, has_upper, has_digit, has_symbol])
    if classes < 3:
        raise ValueError(
            "Use at least 3 of: lowercase, uppercase, numbers, symbols"
        )

    # Block very common weak passwords (minimal list for MVP)
    COMMON = {
        "password", "12345678", "qwerty123", "letmein", "admin123"
    }
    if password.lower() in COMMON:
        raise ValueError("Password is too common")

    # Avoid simple repeats like "aaaaaaa", "11111111"
    if re.fullmatch(r"(.)\1{7,}", password):
        raise ValueError("Password has repeated characters")

    # Avoid long sequential patterns like "abcdefg", "1234567"
    if password.lower() in "abcdefghijklmnopqrstuvwxyz" or password in "0123456789":
        raise ValueError("Password is too predictable")

    return password