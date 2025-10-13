from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import os

from models.database import get_collection
from models.schemas import UserCreate, UserLogin, Token, UserResponse, PasswordReset

router = APIRouter()

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

def verify_password(plain_password, hashed_password):
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    users_collection = get_collection("users")
    user = await users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """
    Register a new user
    
    - **email**: Valid email address
    - **password**: Strong password (min 6 characters)
    - **full_name**: User's full name
    - **role**: User role (default: user)
    """
    users_collection = get_collection("users")
    
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    # Create user
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["created_at"] = datetime.utcnow()
    user_dict["is_active"] = True
    
    result = await users_collection.insert_one(user_dict)
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Get created user
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    
    user_response = UserResponse(
        id=str(created_user["_id"]),
        email=created_user["email"],
        full_name=created_user["full_name"],
        role=created_user["role"],
        created_at=created_user["created_at"],
        is_active=created_user["is_active"]
    )
    
    return Token(access_token=access_token, user=user_response)

@router.post("/login", response_model=Token)
async def login(user_login: UserLogin):
    """
    Login user and get access token
    
    - **email**: Registered email address
    - **password**: User password
    """
    users_collection = get_collection("users")
    
    # Find user
    user = await users_collection.find_one({"email": user_login.email})
    if not user or not verify_password(user_login.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Generate token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    # Log session
    sessions_collection = get_collection("sessions")
    await sessions_collection.insert_one({
        "user_id": str(user["_id"]),
        "token": access_token,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + access_token_expires
    })
    
    # Log activity
    activity_logs = get_collection("activity_logs")
    await activity_logs.insert_one({
        "user_id": str(user["_id"]),
        "action": "login",
        "timestamp": datetime.utcnow(),
        "details": {"email": user["email"]}
    })
    
    user_response = UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        created_at=user["created_at"],
        is_active=user.get("is_active", True)
    )
    
    return Token(access_token=access_token, user=user_response)

@router.post("/forgot-password")
async def forgot_password(reset_request: PasswordReset):
    """
    Request password reset
    
    - **email**: Email address for password reset
    """
    users_collection = get_collection("users")
    
    user = await users_collection.find_one({"email": reset_request.email})
    if not user:
        # Don't reveal if email exists (security best practice)
        return {
            "message": "If the email exists, a password reset link has been sent"
        }
    
    # In production, generate reset token and send email
    # For now, just return success message
    
    # Log password reset request
    activity_logs = get_collection("activity_logs")
    await activity_logs.insert_one({
        "user_id": str(user["_id"]),
        "action": "password_reset_request",
        "timestamp": datetime.utcnow(),
        "details": {"email": user["email"]}
    })
    
    return {
        "message": "If the email exists, a password reset link has been sent"
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Requires: Valid JWT token in Authorization header
    """
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=current_user["role"],
        created_at=current_user["created_at"],
        is_active=current_user.get("is_active", True)
    )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout current user
    
    Requires: Valid JWT token in Authorization header
    """
    # Log activity
    activity_logs = get_collection("activity_logs")
    await activity_logs.insert_one({
        "user_id": str(current_user["_id"]),
        "action": "logout",
        "timestamp": datetime.utcnow(),
        "details": {"email": current_user["email"]}
    })
    
    return {"message": "Successfully logged out"}