"""
Models package initialization
Imports database utilities and all schema models
"""

# Import database utilities
try:
    from .database import connect_db, close_db, get_database, get_collection
except ModuleNotFoundError:
    raise ModuleNotFoundError(
        "Cannot find 'database.py'. Make sure 'database.py' exists in the same folder as __init__.py"
    )

# Import all schema models
try:
    from .schemas import (
        # User & Auth
        UserCreate, UserLogin, UserResponse, Token, PasswordReset,

        # Admin
        AccessControlCreate, AnalyticsRequest, SettingsUpdate,

        # Agriculture
        CropDiseaseDetection, IrrigationScheduleCreate, 
        FertilizerRecommendation, PestControlRequest, AutomationControl,

        # Environment
        CarbonCalculation, DisasterPrediction, WasteLog, ChatbotMessage,

        # Healthcare
        AppointmentCreate, DiagnosisRequest, PatientRecordCreate,
        MedicineRecommendation, VitalSigns, EmergencyPrediction,

        # Common
        DashboardResponse, ReportResponse
    )
except ModuleNotFoundError:
    raise ModuleNotFoundError(
        "Cannot find 'schemas.py'. Make sure 'schemas.py' exists in the same folder as __init__.py"
    )

# Expose all symbols at package level
__all__ = [
    # Database functions
    "connect_db",
    "close_db",
    "get_database",
    "get_collection",

    # User & Auth schemas
    "UserCreate", "UserLogin", "UserResponse", "Token", "PasswordReset",

    # Admin schemas
    "AccessControlCreate", "AnalyticsRequest", "SettingsUpdate",

    # Agriculture schemas
    "CropDiseaseDetection", "IrrigationScheduleCreate", "FertilizerRecommendation",
    "PestControlRequest", "AutomationControl",

    # Environment schemas
    "CarbonCalculation", "DisasterPrediction", "WasteLog", "ChatbotMessage",

    # Healthcare schemas
    "AppointmentCreate", "DiagnosisRequest", "PatientRecordCreate",
    "MedicineRecommendation", "VitalSigns", "EmergencyPrediction",

    # Common schemas
    "DashboardResponse", "ReportResponse"
]
