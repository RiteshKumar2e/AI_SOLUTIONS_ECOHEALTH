from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Query
from datetime import datetime, timedelta
from typing import Optional, List
import random

from models.database import get_collection
from models.schemas import (
    DashboardResponse, CropDiseaseDetection, IrrigationScheduleCreate,
    FertilizerRecommendation, PestControlRequest, AutomationControl
)
from routes.auth import get_current_user

router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
async def get_agriculture_dashboard():
    """Get agriculture dashboard"""
    farms_collection = get_collection("farms")
    crops_collection = get_collection("crops")
    disease_detections = get_collection("disease_detections")
    
    total_farms = await farms_collection.count_documents({})
    total_crops = await crops_collection.count_documents({})
    recent_detections = await disease_detections.count_documents({
        "detected_at": {"$gte": datetime.utcnow() - timedelta(days=7)}
    })
    
    # Get recent activity
    recent_activity = await disease_detections.find().sort("detected_at", -1).limit(5).to_list(5)
    
    formatted_activity = []
    for activity in recent_activity:
        formatted_activity.append({
            "id": str(activity["_id"]),
            "type": "disease_detection",
            "disease": activity.get("disease_name"),
            "timestamp": activity.get("detected_at")
        })
    
    return DashboardResponse(
        stats={
            "total_farms": total_farms,
            "total_crops": total_crops,
            "recent_detections": recent_detections,
            "active_schedules": 15
        },
        recent_activity=formatted_activity,
        alerts=[
            {"type": "warning", "message": "Weather alert: Heavy rain expected", "severity": "medium"}
        ]
    )

@router.post("/crop-disease-detection", response_model=CropDiseaseDetection)
async def detect_crop_disease(file: UploadFile = File(...)):
    """Detect crop disease from image"""
    # In production, integrate with actual ML model
    # For now, simulate disease detection
    
    diseases = [
        {
            "name": "Late Blight",
            "confidence": 0.92,
            "severity": "High",
            "recommendations": [
                "Apply fungicide immediately",
                "Remove infected leaves",
                "Improve air circulation",
                "Reduce irrigation frequency"
            ]
        },
        {
            "name": "Leaf Rust",
            "confidence": 0.85,
            "severity": "Medium",
            "recommendations": [
                "Apply appropriate fungicide",
                "Monitor spread closely",
                "Maintain proper plant spacing"
            ]
        },
        {
            "name": "Healthy",
            "confidence": 0.95,
            "severity": "None",
            "recommendations": [
                "Continue current maintenance",
                "Regular monitoring recommended"
            ]
        }
    ]
    
    detected_disease = random.choice(diseases)
    
    # Log detection
    disease_detections = get_collection("disease_detections")
    await disease_detections.insert_one({
        "disease_name": detected_disease["name"],
        "confidence": detected_disease["confidence"],
        "severity": detected_disease["severity"],
        "detected_at": datetime.utcnow(),
        "image_name": file.filename
    })
    
    return CropDiseaseDetection(
        disease_name=detected_disease["name"],
        confidence=detected_disease["confidence"],
        recommendations=detected_disease["recommendations"],
        severity=detected_disease["severity"]
    )

@router.post("/irrigation/smart-schedule")
async def create_irrigation_schedule(schedule: IrrigationScheduleCreate):
    """Create smart irrigation schedule"""
    schedules_collection = get_collection("irrigation_schedules")
    
    # Calculate irrigation needs based on crop type and weather
    irrigation_plan = {
        "farm_id": schedule.farm_id,
        "crop_type": schedule.crop_type,
        "area_size": schedule.area_size,
        "soil_type": schedule.soil_type,
        "schedule": [
            {"day": "Monday", "time": "06:00", "duration_minutes": 30, "water_amount_liters": 500},
            {"day": "Wednesday", "time": "06:00", "duration_minutes": 30, "water_amount_liters": 500},
            {"day": "Friday", "time": "06:00", "duration_minutes": 30, "water_amount_liters": 500}
        ],
        "total_weekly_water": 1500,
        "created_at": datetime.utcnow(),
        "active": True
    }
    
    result = await schedules_collection.insert_one(irrigation_plan)
    irrigation_plan["_id"] = result.inserted_id
    
    return {
        "id": str(result.inserted_id),
        "schedule": irrigation_plan["schedule"],
        "total_weekly_water": irrigation_plan["total_weekly_water"],
        "recommendations": [
            "Adjust schedule based on rainfall",
            "Monitor soil moisture levels",
            "Consider drip irrigation for better efficiency"
        ]
    }

@router.get("/irrigation/schedules")
async def get_irrigation_schedules(farm_id: Optional[str] = None):
    """Get irrigation schedules"""
    schedules_collection = get_collection("irrigation_schedules")
    
    query = {"active": True}
    if farm_id:
        query["farm_id"] = farm_id
    
    schedules = await schedules_collection.find(query).to_list(50)
    
    formatted_schedules = []
    for schedule in schedules:
        formatted_schedules.append({
            "id": str(schedule["_id"]),
            "farm_id": schedule["farm_id"],
            "crop_type": schedule["crop_type"],
            "schedule": schedule["schedule"],
            "created_at": schedule["created_at"]
        })
    
    return {"schedules": formatted_schedules}

@router.post("/fertilizer/recommendations")
async def get_fertilizer_recommendations(request: FertilizerRecommendation):
    """Get fertilizer recommendations"""
    recommendations_collection = get_collection("fertilizer_recommendations")
    
    # Simulate fertilizer recommendation
    recommendation = {
        "crop_type": request.crop_type,
        "soil_type": request.soil_type,
        "area_size": request.area_size,
        "recommended_fertilizers": [
            {
                "name": "NPK 20-20-20",
                "quantity_kg": request.area_size * 0.5,
                "application_method": "Broadcast",
                "frequency": "Every 2 weeks"
            },
            {
                "name": "Organic Compost",
                "quantity_kg": request.area_size * 2,
                "application_method": "Top dressing",
                "frequency": "Monthly"
            }
        ],
        "application_schedule": [
            {"week": 1, "fertilizer": "NPK 20-20-20", "amount": "50% of recommended"},
            {"week": 3, "fertilizer": "NPK 20-20-20", "amount": "50% of recommended"},
            {"week": 4, "fertilizer": "Organic Compost", "amount": "Full dose"}
        ],
        "estimated_cost": request.area_size * 150,
        "created_at": datetime.utcnow()
    }
    
    await recommendations_collection.insert_one(recommendation)
    
    return recommendation

@router.get("/market/forecast")
async def get_market_forecast(
    crop_type: Optional[str] = None,
    days: int = Query(7, ge=1, le=30)
):
    """Get market price forecasts"""
    forecasts_collection = get_collection("market_forecasts")
    
    # Simulate market forecast
    base_price = 50
    forecast_data = []
    
    for i in range(days):
        date = datetime.utcnow() + timedelta(days=i)
        price = base_price + random.uniform(-5, 10)
        forecast_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "predicted_price": round(price, 2),
            "confidence": round(random.uniform(0.75, 0.95), 2)
        })
    
    return {
        "crop_type": crop_type or "General",
        "forecast_period": f"{days} days",
        "forecast": forecast_data,
        "trend": "increasing",
        "recommendations": [
            "Consider selling in the next 5-7 days for optimal prices",
            "Monitor market trends daily"
        ]
    }

@router.post("/pest-control")
async def get_pest_control_recommendations(request: PestControlRequest):
    """Get pest control recommendations"""
    
    recommendations = {
        "crop_type": request.crop_type,
        "identified_pests": [
            {
                "name": request.pest_type or "Aphids",
                "severity": "Medium",
                "control_methods": [
                    "Neem oil spray",
                    "Introduce beneficial insects (ladybugs)",
                    "Remove infected plant parts"
                ]
            }
        ],
        "preventive_measures": [
            "Regular crop inspection",
            "Maintain field hygiene",
            "Use pest-resistant varieties",
            "Implement crop rotation"
        ],
        "organic_solutions": [
            "Neem oil",
            "Garlic spray",
            "Companion planting"
        ],
        "chemical_solutions": [
            {
                "name": "Imidacloprid",
                "dosage": "0.5ml per liter",
                "precautions": "Wear protective gear, avoid use before harvest"
            }
        ]
    }
    
    return recommendations

@router.get("/supply-chain")
async def get_supply_chain_data():
    """Get supply chain data"""
    orders_collection = get_collection("supply_orders")
    suppliers_collection = get_collection("suppliers")
    
    orders = await orders_collection.find().sort("order_date", -1).limit(10).to_list(10)
    suppliers = await suppliers_collection.find().to_list(20)
    
    formatted_orders = []
    for order in orders:
        formatted_orders.append({
            "id": str(order["_id"]),
            "supplier": order.get("supplier_name"),
            "items": order.get("items", []),
            "status": order.get("status"),
            "order_date": order.get("order_date")
        })
    
    formatted_suppliers = []
    for supplier in suppliers:
        formatted_suppliers.append({
            "id": str(supplier["_id"]),
            "name": supplier.get("name"),
            "category": supplier.get("category"),
            "rating": supplier.get("rating", 4.0)
        })
    
    return {
        "recent_orders": formatted_orders,
        "suppliers": formatted_suppliers,
        "stats": {
            "total_orders": len(formatted_orders),
            "pending_orders": sum(1 for o in formatted_orders if o["status"] == "pending")
        }
    }

@router.get("/weather")
async def get_weather_forecast(
    location: Optional[str] = None,
    days: int = Query(7, ge=1, le=14)
):
    """Get weather forecast"""
    
    forecast = []
    for i in range(days):
        date = datetime.utcnow() + timedelta(days=i)
        forecast.append({
            "date": date.strftime("%Y-%m-%d"),
            "temperature": {
                "min": random.randint(20, 25),
                "max": random.randint(28, 35)
            },
            "humidity": random.randint(60, 85),
            "rainfall_mm": random.uniform(0, 20),
            "wind_speed_kmh": random.uniform(5, 20),
            "condition": random.choice(["Sunny", "Partly Cloudy", "Cloudy", "Rainy"])
        })
    
    return {
        "location": location or "Current Location",
        "forecast": forecast,
        "alerts": [
            {"type": "info", "message": "Favorable conditions for irrigation"}
        ]
    }

@router.get("/community-hub")
async def get_community_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50)
):
    """Get community forum posts"""
    posts_collection = get_collection("community_posts")
    
    skip = (page - 1) * page_size
    posts = await posts_collection.find().sort("created_at", -1).skip(skip).limit(page_size).to_list(page_size)
    total = await posts_collection.count_documents({})
    
    formatted_posts = []
    for post in posts:
        formatted_posts.append({
            "id": str(post["_id"]),
            "title": post.get("title"),
            "content": post.get("content"),
            "author": post.get("author"),
            "created_at": post.get("created_at"),
            "replies": post.get("replies", 0),
            "likes": post.get("likes", 0)
        })
    
    return {
        "posts": formatted_posts,
        "total": total,
        "page": page,
        "page_size": page_size
    }

@router.post("/automation")
async def control_automation(control: AutomationControl):
    """Control farm automation devices"""
    automation_logs = get_collection("automation_logs")
    
    # Log automation action
    log_entry = {
        "device_id": control.device_id,
        "action": control.action,
        "parameters": control.parameters or {},
        "timestamp": datetime.utcnow(),
        "status": "executed"
    }
    
    await automation_logs.insert_one(log_entry)
    
    return {
        "device_id": control.device_id,
        "action": control.action,
        "status": "success",
        "message": f"Device {control.device_id} - {control.action} executed successfully",
        "timestamp": log_entry["timestamp"]
    }