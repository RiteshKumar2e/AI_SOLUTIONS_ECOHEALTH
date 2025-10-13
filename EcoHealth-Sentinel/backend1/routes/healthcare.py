from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Query
from datetime import datetime, timedelta
from typing import Optional, List
import random
from bson import ObjectId

from models.database import get_collection
from models.schemas import (
    DashboardResponse, AppointmentCreate, DiagnosisRequest,
    PatientRecordCreate, MedicineRecommendation, VitalSigns,
    EmergencyPrediction, ChatbotMessage
)
from routes.auth import get_current_user

router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
async def get_healthcare_dashboard():
    """Get healthcare dashboard"""
    appointments_collection = get_collection("appointments")
    patients_collection = get_collection("patients")
    alerts_collection = get_collection("patient_alerts")
    
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)
    
    today_appointments = await appointments_collection.count_documents({
        "appointment_date": {"$gte": today, "$lt": tomorrow}
    })
    
    total_patients = await patients_collection.count_documents({})
    critical_alerts = await alerts_collection.count_documents({"severity": "critical", "status": "active"})
    
    recent_activity = await appointments_collection.find().sort("created_at", -1).limit(5).to_list(5)
    
    formatted_activity = []
    for activity in recent_activity:
        formatted_activity.append({
            "id": str(activity["_id"]),
            "type": "appointment",
            "patient": activity.get("patient_id"),
            "timestamp": activity.get("created_at")
        })
    
    alerts_list = await alerts_collection.find({"status": "active"}).to_list(5)
    formatted_alerts = []
    for alert in alerts_list:
        formatted_alerts.append({
            "type": alert.get("alert_type"),
            "message": alert.get("message"),
            "severity": alert.get("severity")
        })
    
    return DashboardResponse(
        stats={
            "today_appointments": today_appointments,
            "total_patients": total_patients,
            "critical_alerts": critical_alerts,
            "available_doctors": 25
        },
        recent_activity=formatted_activity,
        alerts=formatted_alerts
    )

@router.post("/appointments")
async def schedule_appointment(appointment: AppointmentCreate):
    """Schedule a new appointment"""
    appointments_collection = get_collection("appointments")
    
    # Check if slot is available
    existing = await appointments_collection.find_one({
        "doctor_id": appointment.doctor_id,
        "appointment_date": appointment.appointment_date,
        "status": {"$ne": "cancelled"}
    })
    
    if existing:
        raise HTTPException(status_code=400, detail="Time slot not available")
    
    appointment_data = {
        "patient_id": appointment.patient_id,
        "doctor_id": appointment.doctor_id,
        "appointment_date": appointment.appointment_date,
        "reason": appointment.reason,
        "type": appointment.type,
        "status": "scheduled",
        "created_at": datetime.utcnow()
    }
    
    result = await appointments_collection.insert_one(appointment_data)
    
    return {
        "id": str(result.inserted_id),
        "message": "Appointment scheduled successfully",
        "appointment_date": appointment.appointment_date,
        "status": "scheduled"
    }

@router.get("/appointments")
async def get_appointments(
    patient_id: Optional[str] = None,
    doctor_id: Optional[str] = None,
    status: Optional[str] = None,
    date: Optional[datetime] = None
):
    """Get appointments with filters"""
    appointments_collection = get_collection("appointments")
    
    query = {}
    if patient_id:
        query["patient_id"] = patient_id
    if doctor_id:
        query["doctor_id"] = doctor_id
    if status:
        query["status"] = status
    if date:
        start = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=1)
        query["appointment_date"] = {"$gte": start, "$lt": end}
    
    appointments = await appointments_collection.find(query).sort("appointment_date", 1).to_list(100)
    
    formatted_appointments = []
    for appt in appointments:
        formatted_appointments.append({
            "id": str(appt["_id"]),
            "patient_id": appt["patient_id"],
            "doctor_id": appt["doctor_id"],
            "appointment_date": appt["appointment_date"],
            "reason": appt["reason"],
            "type": appt["type"],
            "status": appt["status"]
        })
    
    return {"appointments": formatted_appointments}

@router.get("/appointments/{appointment_id}")
async def get_appointment(appointment_id: str):
    """Get specific appointment"""
    appointments_collection = get_collection("appointments")
    
    try:
        appointment = await appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid appointment ID")
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    return {
        "id": str(appointment["_id"]),
        "patient_id": appointment["patient_id"],
        "doctor_id": appointment["doctor_id"],
        "appointment_date": appointment["appointment_date"],
        "reason": appointment["reason"],
        "type": appointment["type"],
        "status": appointment["status"],
        "created_at": appointment["created_at"]
    }

@router.post("/diagnosis-assistant")
async def ai_diagnosis_assistant(request: DiagnosisRequest):
    """AI-powered diagnosis suggestions"""
    diagnosis_collection = get_collection("diagnosis_requests")
    
    # Simulate AI diagnosis
    possible_conditions = []
    
    if "fever" in [s.lower() for s in request.symptoms]:
        possible_conditions.append({
            "condition": "Viral Infection",
            "confidence": 0.75,
            "description": "Common viral infection causing fever and related symptoms",
            "recommendations": ["Rest", "Stay hydrated", "Monitor temperature"]
        })
    
    if "cough" in [s.lower() for s in request.symptoms]:
        possible_conditions.append({
            "condition": "Upper Respiratory Infection",
            "confidence": 0.68,
            "description": "Infection of upper respiratory tract",
            "recommendations": ["Warm fluids", "Steam inhalation", "Avoid cold exposure"]
        })
    
    if not possible_conditions:
        possible_conditions.append({
            "condition": "General Assessment Needed",
            "confidence": 0.50,
            "description": "Symptoms require professional medical evaluation",
            "recommendations": ["Consult a doctor", "Track symptoms", "Note any changes"]
        })
    
    diagnosis_data = {
        "patient_id": request.patient_id,
        "symptoms": request.symptoms,
        "duration": request.duration,
        "severity": request.severity,
        "possible_conditions": possible_conditions,
        "created_at": datetime.utcnow()
    }
    
    await diagnosis_collection.insert_one(diagnosis_data)
    
    return {
        "possible_conditions": possible_conditions,
        "disclaimer": "This is AI-assisted suggestion only. Please consult a healthcare professional for accurate diagnosis.",
        "recommended_tests": ["Complete Blood Count", "Chest X-Ray"],
        "urgency": "Medium" if request.severity == "high" else "Low"
    }

@router.post("/patient-records")
async def create_patient_record(record: PatientRecordCreate):
    """Create patient medical record"""
    records_collection = get_collection("patient_records")
    
    record_data = {
        "patient_id": record.patient_id,
        "record_type": record.record_type,
        "diagnosis": record.diagnosis,
        "treatment": record.treatment,
        "medications": record.medications,
        "notes": record.notes,
        "created_at": datetime.utcnow()
    }
    
    result = await records_collection.insert_one(record_data)
    
    return {
        "id": str(result.inserted_id),
        "message": "Patient record created successfully"
    }

@router.get("/patient-records/{patient_id}")
async def get_patient_records(patient_id: str):
    """Get patient medical records"""
    records_collection = get_collection("patient_records")
    
    records = await records_collection.find({"patient_id": patient_id}).sort("created_at", -1).to_list(50)
    
    formatted_records = []
    for record in records:
        formatted_records.append({
            "id": str(record["_id"]),
            "record_type": record["record_type"],
            "diagnosis": record["diagnosis"],
            "treatment": record["treatment"],
            "medications": record["medications"],
            "notes": record.get("notes"),
            "created_at": record["created_at"]
        })
    
    return {"records": formatted_records}

@router.post("/medical-image-analysis")
async def analyze_medical_image(file: UploadFile = File(...)):
    """Analyze medical images using AI"""
    analyses_collection = get_collection("image_analyses")
    
    # Simulate medical image analysis
    analysis_types = [
        {
            "type": "X-Ray",
            "findings": ["Normal bone structure", "No fractures detected"],
            "confidence": 0.92,
            "abnormalities": []
        },
        {
            "type": "CT Scan",
            "findings": ["Clear imaging", "No significant abnormalities"],
            "confidence": 0.88,
            "abnormalities": []
        }
    ]
    
    analysis = random.choice(analysis_types)
    
    analysis_data = {
        "image_name": file.filename,
        "analysis_type": analysis["type"],
        "findings": analysis["findings"],
        "confidence": analysis["confidence"],
        "abnormalities": analysis["abnormalities"],
        "analyzed_at": datetime.utcnow()
    }
    
    result = await analyses_collection.insert_one(analysis_data)
    
    return {
        "analysis_id": str(result.inserted_id),
        "type": analysis["type"],
        "findings": analysis["findings"],
        "confidence": analysis["confidence"],
        "recommendations": ["Review with radiologist", "Follow-up in 6 months"],
        "disclaimer": "AI analysis should be confirmed by medical professionals"
    }

@router.post("/medicine-recommendations")
async def get_medicine_recommendations(request: MedicineRecommendation):
    """Get medicine recommendations"""
    
    # Simulate medicine recommendations
    medicines = []
    
    if "fever" in request.diagnosis.lower():
        medicines.append({
            "name": "Paracetamol",
            "dosage": "500mg",
            "frequency": "Every 6 hours",
            "duration": "3-5 days",
            "instructions": "Take after meals"
        })
    
    if "pain" in request.diagnosis.lower():
        medicines.append({
            "name": "Ibuprofen",
            "dosage": "400mg",
            "frequency": "Every 8 hours",
            "duration": "5 days",
            "instructions": "Take with food"
        })
    
    if not medicines:
        medicines.append({
            "name": "Multivitamin",
            "dosage": "1 tablet",
            "frequency": "Once daily",
            "duration": "30 days",
            "instructions": "Take after breakfast"
        })
    
    return {
        "recommended_medicines": medicines,
        "precautions": [
            "Complete the full course",
            "Do not exceed recommended dosage",
            "Consult doctor if symptoms persist"
        ],
        "interactions": request.current_medications or [],
        "disclaimer": "This is a recommendation. Consult your doctor before taking any medication."
    }

@router.post("/remote-monitoring")
async def submit_vital_signs(vitals: VitalSigns):
    """Submit patient vital signs for remote monitoring"""
    vitals_collection = get_collection("vital_signs")
    
    vitals_data = {
        "patient_id": vitals.patient_id,
        "heart_rate": vitals.heart_rate,
        "blood_pressure": vitals.blood_pressure,
        "temperature": vitals.temperature,
        "oxygen_saturation": vitals.oxygen_saturation,
        "timestamp": vitals.timestamp or datetime.utcnow()
    }
    
    result = await vitals_collection.insert_one(vitals_data)
    
    # Check for abnormal values
    alerts = []
    if vitals.heart_rate < 60 or vitals.heart_rate > 100:
        alerts.append("Heart rate outside normal range")
    if vitals.temperature > 38.0:
        alerts.append("Elevated temperature detected")
    if vitals.oxygen_saturation < 95:
        alerts.append("Low oxygen saturation")
    
    # Create alert if critical
    if alerts:
        alerts_collection = get_collection("patient_alerts")
        await alerts_collection.insert_one({
            "patient_id": vitals.patient_id,
            "alert_type": "vital_signs",
            "severity": "high" if len(alerts) > 1 else "medium",
            "message": ", ".join(alerts),
            "status": "active",
            "created_at": datetime.utcnow()
        })
    
    return {
        "id": str(result.inserted_id),
        "status": "recorded",
        "alerts": alerts,
        "assessment": "Normal" if not alerts else "Attention Required"
    }

@router.get("/emergency-prediction")
async def predict_emergency_risk(patient_id: str):
    """Predict emergency risk for patient"""
    vitals_collection = get_collection("vital_signs")
    records_collection = get_collection("patient_records")
    
    # Get recent vital signs
    recent_vitals = await vitals_collection.find(
        {"patient_id": patient_id}
    ).sort("timestamp", -1).limit(10).to_list(10)
    
    # Get medical history
    medical_history = await records_collection.find(
        {"patient_id": patient_id}
    ).limit(5).to_list(5)
    
    # Simulate risk calculation
    risk_score = random.uniform(0, 1)
    risk_level = "Low"
    if risk_score > 0.7:
        risk_level = "High"
    elif risk_score > 0.4:
        risk_level = "Medium"
    
    risk_factors = []
    if len(recent_vitals) > 0:
        latest_vitals = recent_vitals[0]
        if latest_vitals.get("heart_rate", 70) > 100:
            risk_factors.append("Elevated heart rate")
        if latest_vitals.get("oxygen_saturation", 98) < 95:
            risk_factors.append("Low oxygen saturation")
    
    return {
        "patient_id": patient_id,
        "risk_level": risk_level,
        "risk_score": round(risk_score, 2),
        "risk_factors": risk_factors if risk_factors else ["No significant risk factors"],
        "recommendations": [
            "Continue regular monitoring",
            "Schedule follow-up appointment",
            "Maintain medication compliance"
        ],
        "next_checkup": (datetime.utcnow() + timedelta(days=30)).strftime("%Y-%m-%d")
    }

@router.get("/telemedicine")
async def get_telemedicine_sessions(
    patient_id: Optional[str] = None,
    status: Optional[str] = None
):
    """Get telemedicine sessions"""
    sessions_collection = get_collection("telemedicine_sessions")
    
    query = {}
    if patient_id:
        query["patient_id"] = patient_id
    if status:
        query["status"] = status
    
    sessions = await sessions_collection.find(query).sort("scheduled_at", -1).to_list(50)
    
    formatted_sessions = []
    for session in sessions:
        formatted_sessions.append({
            "id": str(session["_id"]),
            "patient_id": session["patient_id"],
            "doctor_id": session["doctor_id"],
            "scheduled_at": session["scheduled_at"],
            "status": session["status"],
            "duration_minutes": session.get("duration_minutes", 30)
        })
    
    return {"sessions": formatted_sessions}

@router.get("/reports")
async def get_healthcare_reports():
    """Get healthcare reports"""
    reports_collection = get_collection("healthcare_reports")
    
    reports = await reports_collection.find().sort("created_at", -1).limit(10).to_list(10)
    
    formatted_reports = []
    for report in reports:
        formatted_reports.append({
            "id": str(report["_id"]),
            "title": report.get("title"),
            "type": report.get("type"),
            "summary": report.get("summary"),
            "created_at": report.get("created_at")
        })
    
    return {"reports": formatted_reports}

@router.get("/settings")
async def get_healthcare_settings():
    """Get healthcare settings"""
    settings_collection = get_collection("settings")
    
    settings = await settings_collection.find_one({"type": "healthcare"})
    
    if not settings:
        return {"settings": {}}
    
    return {
        "settings": settings.get("data", {}),
        "updated_at": settings.get("updated_at")
    }

@router.post("/chatbot")
async def healthcare_chatbot(message: ChatbotMessage):
    """Healthcare domain chatbot"""
    chatbot_logs = get_collection("chatbot_logs")
    
    # Simulate chatbot response
    responses = {
        "appointment": "I can help you schedule an appointment. Please provide your preferred date and time, along with the reason for visit.",
        "symptoms": "Please describe your symptoms in detail. Include when they started, their severity, and any other relevant information. Remember, this is not a substitute for professional medical advice.",
        "medicine": "I can provide general information about medications. However, always consult your doctor or pharmacist for specific medical advice and prescriptions.",
        "default": "I'm here to help with healthcare information, appointment scheduling, and general medical queries. How can I assist you today?"
    }
    
    # Simple keyword matching
    msg_lower = message.message.lower()
    if "appointment" in msg_lower or "schedule" in msg_lower:
        response = responses["appointment"]
    elif "symptom" in msg_lower or "sick" in msg_lower:
        response = responses["symptoms"]
    elif "medicine" in msg_lower or "medication" in msg_lower:
        response = responses["medicine"]
    else:
        response = responses["default"]
    
    # Log conversation
    await chatbot_logs.insert_one({
        "domain": "healthcare",
        "user_message": message.message,
        "bot_response": response,
        "timestamp": datetime.utcnow()
    })
    
    return {
        "response": response,
        "suggestions": [
            "Schedule an appointment",
            "Check my symptoms",
            "Find nearby hospitals",
            "View my medical records"
        ]
    }