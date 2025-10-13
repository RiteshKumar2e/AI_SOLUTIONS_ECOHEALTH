from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime
from typing import Optional
from bson import ObjectId

from models.database import get_collection
from models.schemas import (
    DashboardResponse, AccessControlCreate, AnalyticsRequest,
    SettingsUpdate, ReportResponse
)
from routes.auth import get_current_user

router = APIRouter()

# 🔹 Basic admin test route
@router.get("/admin/test")
def test_admin():
    """Simple test route to confirm admin routes are loaded"""
    collection = get_collection("admins")
    return {"message": "Admin route working!", "collection": str(collection.name)}

# 🔹 Verify admin role
def verify_admin(current_user: dict = Depends(get_current_user)):
    """Verify user has admin role"""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# 🔹 Admin dashboard
@router.get("/dashboard", response_model=DashboardResponse)
async def get_admin_dashboard(current_user: dict = Depends(verify_admin)):
    """Get admin dashboard statistics"""
    users_collection = get_collection("users")
    sessions_collection = get_collection("sessions")
    activity_logs = get_collection("activity_logs")
    
    total_users = await users_collection.count_documents({})
    active_sessions = await sessions_collection.count_documents({
        "expires_at": {"$gt": datetime.utcnow()}
    })
    recent_activity = await activity_logs.find().sort("timestamp", -1).limit(10).to_list(10)
    
    formatted_activity = [
        {
            "id": str(a["_id"]),
            "user_id": a.get("user_id"),
            "action": a.get("action"),
            "timestamp": a.get("timestamp"),
            "details": a.get("details", {})
        }
        for a in recent_activity
    ]
    
    return DashboardResponse(
        stats={
            "total_users": total_users,
            "active_sessions": active_sessions,
            "total_api_calls": await get_collection("api_logs").count_documents({})
        },
        recent_activity=formatted_activity,
        alerts=[]
    )

# 🔹 Get users (paginated)
@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(verify_admin)
):
    """Get all users with pagination"""
    users_collection = get_collection("users")
    skip = (page - 1) * page_size
    users = await users_collection.find().skip(skip).limit(page_size).to_list(page_size)
    total = await users_collection.count_documents({})
    
    formatted_users = [
        {
            "id": str(u["_id"]),
            "email": u["email"],
            "full_name": u["full_name"],
            "role": u["role"],
            "created_at": u["created_at"],
            "is_active": u.get("is_active", True)
        }
        for u in users
    ]
    
    return {"users": formatted_users, "total": total, "page": page, "page_size": page_size}

# 🔹 Get specific user
@router.get("/users/{user_id}")
async def get_user(user_id: str, current_user: dict = Depends(verify_admin)):
    """Get specific user by ID"""
    users_collection = get_collection("users")
    
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "created_at": user["created_at"],
        "is_active": user.get("is_active", True)
    }

# 🔹 Delete user
@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(verify_admin)):
    """Delete user by ID"""
    users_collection = get_collection("users")
    
    try:
        result = await users_collection.delete_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User deleted successfully"}

# 🔹 Create access control rule
@router.post("/access-control")
async def create_access_control(
    access: AccessControlCreate,
    current_user: dict = Depends(verify_admin)
):
    """Create access control rule"""
    access_control = get_collection("access_control")
    rule = {
        "user_id": access.user_id,
        "domain": access.domain,
        "permissions": access.permissions,
        "created_at": datetime.utcnow(),
        "created_by": str(current_user["_id"])
    }
    result = await access_control.insert_one(rule)
    return {"id": str(result.inserted_id), "message": "Access control rule created"}

# 🔹 Get access control rules
@router.get("/access-control")
async def get_access_control(current_user: dict = Depends(verify_admin)):
    """Get all access control rules"""
    access_control = get_collection("access_control")
    rules = await access_control.find().to_list(100)
    
    formatted_rules = [
        {
            "id": str(r["_id"]),
            "user_id": r["user_id"],
            "domain": r["domain"],
            "permissions": r["permissions"],
            "created_at": r["created_at"]
        }
        for r in rules
    ]
    return {"rules": formatted_rules}

# 🔹 Analytics
@router.post("/analytics")
async def get_analytics(
    request: AnalyticsRequest,
    current_user: dict = Depends(verify_admin)
):
    """Get analytics data"""
    api_logs = get_collection("api_logs")
    query = {"domain": request.domain}
    if request.start_date:
        query["timestamp"] = {"$gte": request.start_date}
    if request.end_date:
        query.setdefault("timestamp", {})["$lte"] = request.end_date
    
    total_requests = await api_logs.count_documents(query)
    return {
        "domain": request.domain,
        "total_requests": total_requests,
        "period": {"start": request.start_date, "end": request.end_date}
    }

# 🔹 Reports
@router.get("/reports", response_model=ReportResponse)
async def get_reports(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(verify_admin)
):
    """Get reports"""
    reports_collection = get_collection("reports")
    skip = (page - 1) * page_size
    reports = await reports_collection.find().skip(skip).limit(page_size).to_list(page_size)
    total = await reports_collection.count_documents({})
    
    formatted_reports = [
        {
            "id": str(r["_id"]),
            "title": r.get("title"),
            "type": r.get("type"),
            "created_at": r.get("created_at"),
            "status": r.get("status")
        }
        for r in reports
    ]
    return ReportResponse(reports=formatted_reports, total=total, page=page, page_size=page_size)

# 🔹 Settings - get
@router.get("/settings")
async def get_settings(current_user: dict = Depends(verify_admin)):
    """Get admin settings"""
    settings_collection = get_collection("settings")
    settings = await settings_collection.find_one({"type": "admin"})
    if not settings:
        return {"settings": {}}
    return {
        "settings": settings.get("data", {}),
        "updated_at": settings.get("updated_at")
    }

# 🔹 Settings - update
@router.put("/settings")
async def update_settings(
    settings_update: SettingsUpdate,
    current_user: dict = Depends(verify_admin)
):
    """Update admin settings"""
    settings_collection = get_collection("settings")
    await settings_collection.update_one(
        {"type": "admin"},
        {
            "$set": {
                "data": settings_update.settings,
                "updated_at": datetime.utcnow(),
                "updated_by": str(current_user["_id"])
            }
        },
        upsert=True
    )
    return {"message": "Settings updated successfully"}
