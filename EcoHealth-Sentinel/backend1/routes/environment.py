# routes/environment.py
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId

router = APIRouter()

class CarbonCalculation(BaseModel):
    activity_type: str
    value: float
    unit: str

class DisasterAlert(BaseModel):
    disaster_type: str
    location: str
    severity: str
    description: str

@router.get("/dashboard")
async def get_environment_dashboard(request: Request):
    db = request.app.mongodb
    
    dashboard = {
        "air_quality_index": 85,
        "carbon_footprint_today": 1250,
        "active_alerts": await db.disaster_alerts.count_documents({"status": "active"}),
        "renewable_energy_usage": 45.5,
        "waste_recycled_today": 320,
        "wildlife_sightings": await db.wildlife_sightings.count_documents({}),
        "pollution_hotspots": 8
    }
    
    return dashboard

@router.post("/carbon-calculator")
async def calculate_carbon_footprint(data: CarbonCalculation, request: Request):
    db = request.app.mongodb
    
    # Carbon emission factors (kg CO2 per unit)
    emission_factors = {
        "electricity": 0.5,  # per kWh
        "gasoline": 2.3,     # per liter
        "natural_gas": 2.0,  # per cubic meter
        "flight": 90,        # per hour
        "car": 0.12,         # per km
        "public_transport": 0.04  # per km
    }
    
    factor = emission_factors.get(data.activity_type.lower(), 1.0)
    carbon_emission = data.value * factor
    
    result = {
        "activity": data.activity_type,
        "input_value": data.value,
        "unit": data.unit,
        "carbon_emission_kg": round(carbon_emission, 2),
        "carbon_emission_tons": round(carbon_emission / 1000, 4),
        "trees_to_offset": round(carbon_emission / 21, 1),  # 1 tree absorbs ~21kg CO2/year
        "recommendations": [
            "Consider using renewable energy sources",
            "Reduce consumption where possible",
            "Offset with tree planting or carbon credits"
        ]
    }
    
    # Save calculation
    await db.carbon_calculations.insert_one({
        **data.dict(),
        "result": result,
        "timestamp": datetime.utcnow()
    })
    
    return result

@router.get("/climate-predictions")
async def get_climate_predictions(request: Request, location: Optional[str] = None):
    predictions = {
        "location": location or "Global",
        "current_temperature": 26.5,
        "predictions": {
            "1_month": {
                "temperature_change": "+0.5°C",
                "precipitation": "above average",
                "extreme_events": "low probability"
            },
            "3_months": {
                "temperature_change": "+1.2°C",
                "precipitation": "below average",
                "extreme_events": "moderate probability"
            },
            "1_year": {
                "temperature_change": "+1.8°C",
                "precipitation": "variable",
                "extreme_events": "high probability"
            }
        },
        "climate_risks": [
            {"risk": "Heat waves", "probability": "high", "impact": "severe"},
            {"risk": "Drought", "probability": "moderate", "impact": "moderate"},
            {"risk": "Flooding", "probability": "low", "impact": "high"}
        ],
        "adaptation_strategies": [
            "Improve water conservation",
            "Enhance urban green spaces",
            "Upgrade infrastructure resilience"
        ]
    }
    
    return predictions

@router.post("/disaster-prediction")
async def predict_disaster(disaster_type: str, location: str, request: Request):
    db = request.app.mongodb
    
    prediction = {
        "disaster_type": disaster_type,
        "location": location,
        "risk_level": "moderate",
        "probability": 0.65,
        "time_window": "next 7 days",
        "severity_estimate": "moderate to high",
        "affected_radius_km": 50,
        "recommendations": [
            "Monitor weather conditions closely",
            "Prepare emergency supplies",
            "Review evacuation routes",
            "Stay informed through official channels"
        ],
        "historical_data": {
            "last_occurrence": "2023-08-15",
            "frequency": "once every 2 years",
            "average_impact": "moderate"
        },
        "prediction_timestamp": datetime.utcnow()
    }
    
    # Save prediction
    await db.disaster_predictions.insert_one(prediction)
    
    return prediction

@router.get("/pollution-heatmap")
async def get_pollution_heatmap(request: Request, pollutant: Optional[str] = "pm2.5"):
    heatmap_data = {
        "pollutant": pollutant,
        "unit": "µg/m³" if pollutant == "pm2.5" else "ppm",
        "timestamp": datetime.utcnow().isoformat(),
        "locations": [
            {"lat": 22.8046, "lng": 86.2029, "value": 95, "status": "moderate"},
            {"lat": 22.7867, "lng": 86.1845, "value": 120, "status": "unhealthy"},
            {"lat": 22.8156, "lng": 86.2234, "value": 75, "status": "good"},
            {"lat": 22.7956, "lng": 86.2123, "value": 105, "status": "moderate"},
            {"lat": 22.8234, "lng": 86.1967, "value": 145, "status": "unhealthy"}
        ],
        "legend": {
            "good": "0-50",
            "moderate": "51-100",
            "unhealthy": "101-150",
            "very_unhealthy": "151-200",
            "hazardous": "201+"
        }
    }
    
    return heatmap_data

@router.get("/renewable-energy")
async def get_renewable_energy_data(request: Request):
    db = request.app.mongodb
    
    energy_data = {
        "current_generation": {
            "solar": 450,  # MW
            "wind": 320,
            "hydro": 890,
            "biomass": 120,
            "total": 1780
        },
        "capacity": {
            "solar": 600,
            "wind": 450,
            "hydro": 1000,
            "biomass": 150,
            "total": 2200
        },
        "efficiency_percentage": 80.9,
        "co2_avoided_today": 2450,  # tons
        "daily_trends": [
            {"hour": "00:00", "generation": 890},
            {"hour": "06:00", "generation": 1200},
            {"hour": "12:00", "generation": 1780},
            {"hour": "18:00", "generation": 1450},
            {"hour": "23:00", "generation": 920}
        ],
        "recommendations": [
            "Increase solar panel installation",
            "Optimize wind turbine placement",
            "Implement battery storage systems"
        ]
    }
    
    return energy_data

@router.get("/wildlife-conservation")
async def get_wildlife_data(request: Request, species: Optional[str] = None):
    db = request.app.mongodb
    
    query = {"species": species} if species else {}
    sightings = await db.wildlife_sightings.find(query).sort("date", -1).limit(20).to_list(length=20)
    
    for sighting in sightings:
        sighting["_id"] = str(sighting["_id"])
    
    conservation_data = {
        "total_species_monitored": 45,
        "endangered_species": 12,
        "recent_sightings": sightings,
        "conservation_status": {
            "critically_endangered": 3,
            "endangered": 9,
            "vulnerable": 15,
            "near_threatened": 8,
            "least_concern": 10
        },
        "habitat_health": {
            "forests": "good",
            "wetlands": "moderate",
            "grasslands": "poor",
            "marine": "moderate"
        },
        "active_projects": await db.conservation_projects.count_documents({"status": "active"})
    }
    
    return conservation_data

@router.post("/waste-management")
async def log_waste_data(waste_type: str, quantity: float, unit: str, request: Request):
    db = request.app.mongodb
    
    recycling_rates = {
        "plastic": 0.25,
        "paper": 0.65,
        "glass": 0.75,
        "metal": 0.85,
        "organic": 0.90,
        "electronic": 0.45
    }
    
    rate = recycling_rates.get(waste_type.lower(), 0.3)
    recyclable_amount = quantity * rate
    
    waste_log = {
        "waste_type": waste_type,
        "quantity": quantity,
        "unit": unit,
        "recyclable_amount": recyclable_amount,
        "recycling_rate": rate,
        "environmental_impact": {
            "co2_saved_kg": recyclable_amount * 2.5,
            "energy_saved_kwh": recyclable_amount * 5,
            "landfill_space_saved_m3": recyclable_amount * 0.8
        },
        "timestamp": datetime.utcnow()
    }
    
    result = await db.waste_logs.insert_one(waste_log)
    waste_log["_id"] = str(result.inserted_id)
    
    return waste_log

@router.get("/awareness-hub")
async def get_awareness_content(request: Request, category: Optional[str] = None):
    db = request.app.mongodb
    
    query = {"category": category} if category else {}
    content = await db.awareness_content.find(query).limit(10).to_list(length=10)
    
    if not content:
        content = [
            {
                "title": "Understanding Climate Change",
                "category": "climate",
                "description": "Learn about the causes and effects of climate change",
                "content_type": "article",
                "views": 1250
            },
            {
                "title": "Reducing Your Carbon Footprint",
                "category": "lifestyle",
                "description": "Practical tips for sustainable living",
                "content_type": "guide",
                "views": 890
            },
            {
                "title": "Wildlife Conservation 101",
                "category": "conservation",
                "description": "How to protect endangered species",
                "content_type": "video",
                "views": 2100
            }
        ]
    
    for item in content:
        if "_id" in item:
            item["_id"] = str(item["_id"])
    
    return {"content": content}

@router.get("/reports")
async def get_environment_reports(request: Request, report_type: Optional[str] = None):
    db = request.app.mongodb
    
    query = {"type": report_type} if report_type else {}
    reports = await db.environment_reports.find(query).sort("created_at", -1).to_list(length=20)
    
    for report in reports:
        report["_id"] = str(report["_id"])
    
    return {"reports": reports}

@router.get("/settings")
async def get_environment_settings(request: Request):
    db = request.app.mongodb
    settings = await db.settings.find_one({"type": "environment"})
    
    if settings:
        settings["_id"] = str(settings["_id"])
        return settings
    
    return {
        "type": "environment",
        "alert_threshold": {
            "air_quality": 150,
            "temperature": 35,
            "pollution": 100
        },
        "monitoring_enabled": True,
        "notification_preferences": {
            "disasters": True,
            "pollution_alerts": True,
            "wildlife_updates": False
        }
    }

@router.post("/chatbot")
async def environment_chatbot(message: str, request: Request):
    # Simple chatbot responses
    responses = {
        "climate": "Climate change is caused by increased greenhouse gas emissions. Key actions include reducing carbon footprint, using renewable energy, and supporting sustainable practices.",
        "pollution": "Air pollution can be reduced by using public transport, planting trees, and reducing industrial emissions. Check local air quality regularly.",
        "conservation": "Wildlife conservation involves protecting habitats, preventing poaching, and supporting biodiversity. You can help by reducing consumption and supporting conservation organizations.",
        "default": "I can help you with information about climate change, pollution, wildlife conservation, and sustainable living. What would you like to know?"
    }
    
    message_lower = message.lower()
    response = responses["default"]
    
    for key in responses:
        if key in message_lower:
            response = responses[key]
            break
    
    # Log conversation
    db = request.app.mongodb
    await db.chatbot_logs.insert_one({
        "message": message,
        "response": response,
        "timestamp": datetime.utcnow()
    })
    
    return {"response": response, "timestamp": datetime.utcnow().isoformat()}