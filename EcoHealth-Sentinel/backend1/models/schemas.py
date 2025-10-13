# models/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ==================== USER & AUTH SCHEMAS ====================

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    role: str = "user"  # admin, user, doctor, farmer

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class PasswordReset(BaseModel):
    email: EmailStr
    new_password: str
    reset_token: Optional[str] = None


# ==================== ADMIN SCHEMAS ====================

class AccessControlCreate(BaseModel):
    role: str
    permissions: List[str]
    resources: List[str]

class AnalyticsRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    metrics: List[str] = ["users", "api_calls", "activity"]

class SettingsUpdate(BaseModel):
    type: str  # admin, agriculture, environment, healthcare
    config: Dict[str, Any]


# ==================== AGRICULTURE SCHEMAS ====================

class CropDiseaseDetection(BaseModel):
    image_base64: Optional[str] = None
    image_url: Optional[str] = None
    crop_type: Optional[str] = None

class IrrigationScheduleCreate(BaseModel):
    field_id: str
    crop_type: str
    soil_moisture: float
    weather_data: Optional[Dict[str, Any]] = None

class FertilizerRecommendation(BaseModel):
    crop_type: str
    soil_type: str
    nitrogen: float
    phosphorus: float
    potassium: float

class PestControlRequest(BaseModel):
    pest_type: str
    severity: str  # low, moderate, high
    crop_affected: str
    area_hectares: float

class AutomationControl(BaseModel):
    device_id: str
    action: str  # start, stop, schedule
    parameters: Optional[Dict[str, Any]] = None


# ==================== ENVIRONMENT SCHEMAS ====================

class CarbonCalculation(BaseModel):
    activity_type: str  # travel, energy, food, waste
    value: float
    unit: str

class DisasterPrediction(BaseModel):
    disaster_type: str  # flood, drought, earthquake, cyclone
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class WasteLog(BaseModel):
    waste_type: str  # plastic, organic, electronic, paper
    quantity: float
    unit: str = "kg"
    recyclable: bool = False

class ChatbotMessage(BaseModel):
    message: str
    domain: str  # agriculture, environment, healthcare
    context: Optional[Dict[str, Any]] = None


# ==================== HEALTHCARE SCHEMAS ====================

class AppointmentCreate(BaseModel):
    patient_name: str
    doctor_name: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    reason: str

class DiagnosisRequest(BaseModel):
    symptoms: List[str]
    duration: str
    severity: str  # mild, moderate, severe
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None

class PatientRecordCreate(BaseModel):
    patient_id: str
    diagnosis: str
    prescription: List[str]
    notes: Optional[str] = None
    doctor_id: str

class MedicineRecommendation(BaseModel):
    condition: str
    patient_age: int
    allergies: Optional[List[str]] = None
    current_medications: Optional[List[str]] = None

class VitalSigns(BaseModel):
    patient_id: str
    heart_rate: int
    blood_pressure: str  # e.g., "120/80"
    temperature: float
    oxygen_saturation: int
    respiratory_rate: Optional[int] = None

class EmergencyPrediction(BaseModel):
    patient_id: str
    vital_signs: VitalSigns
    symptoms: List[str]
    medical_history: Optional[Dict[str, Any]] = None


# ==================== COMMON/RESPONSE SCHEMAS ====================

class DashboardResponse(BaseModel):
    total_users: int
    active_sessions: int
    api_calls_today: int
    system_health: str
    recent_activities: List[Dict[str, Any]]

class ReportResponse(BaseModel):
    report_id: str
    report_type: str
    title: str
    data: Dict[str, Any]
    created_at: datetime
    created_by: str


# ==================== ADDITIONAL MODELS ====================

class FarmCreate(BaseModel):
    name: str
    location: Dict[str, float]  # {"lat": float, "lng": float}
    size_hectares: float
    crops: List[str]

class MarketForecast(BaseModel):
    commodity: str
    current_price: float
    forecast_7days: float
    forecast_30days: float
    trend: str

class PatientCreate(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    contact: str

class DoctorCreate(BaseModel):
    name: str
    specialization: str
    contact: str
    status: str = "available"

class ConservationProject(BaseModel):
    name: str
    species: List[str]
    start_date: datetime
    budget: float

class AwarenessContent(BaseModel):
    title: str
    category: str
    description: str
    content_type: str  # article, video, guide