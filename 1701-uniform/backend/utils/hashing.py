import hashlib
import hmac
import secrets


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260_000)
    return f"pbkdf2$sha256${salt}${key.hex()}"


def verify_password(plain: str, hashed: str) -> bool:
    if not hashed or not hashed.startswith("pbkdf2$"):
        return False
    try:
        _, algo, salt, stored = hashed.split("$")
        key = hashlib.pbkdf2_hmac(algo, plain.encode(), salt.encode(), 260_000)
        return hmac.compare_digest(key.hex(), stored)
    except Exception:
        return False
