"""
Database Initialization Script
Initializes MongoDB collections, creates indexes, and adds sample data
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://aiadmin:mypassword123@cluster0.n9mmmbt.mongodb.net")
DB_NAME = os.getenv("DB_NAME", "ai_platform_db")

# MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]


async def create_indexes():
    """Create database indexes for better performance"""
    print("📊 Creating indexes...")
    
    try:
        # Users collection
        await db.users.create_index("email", unique=True)
        await db.users.create_index("role")
        print("  ✓ Users indexes created")
        
        # Farms collection
        await db.farms.create_index("userId")
        await db.farms.create_index("status")
        print("  ✓ Farms indexes created")
        
        # Appointments collection
        await db.appointments.create_index("patientId")
        await db.appointments.create_index("doctorId")
        await db.appointments.create_index("date")
        await db.appointments.create_index("status")
        print("  ✓ Appointments indexes created")
        
        # Crop diseases collection
        await db.crop_diseases.create_index("userId")
        await db.crop_diseases.create_index("detectedAt")
        print("  ✓ Crop diseases indexes created")
        
        # Disease detections collection
        await db.disease_detections.create_index("userId")
        await db.disease_detections.create_index("timestamp")
        print("  ✓ Disease detections indexes created")
        
        # Chatbot logs collection
        await db.chatbot_logs.create_index("userId")
        await db.chatbot_logs.create_index("domain")
        await db.chatbot_logs.create_index("createdAt")
        print("  ✓ Chatbot logs indexes created")
        
        # API logs collection
        await db.api_logs.create_index("timestamp")
        await db.api_logs.create_index("endpoint")
        print("  ✓ API logs indexes created")
        
        print("✅ All indexes created successfully!\n")
        
    except Exception as e:
        print(f"❌ Error creating indexes: {e}")


async def create_admin_user():
    """Create default admin user"""
    print("👤 Creating admin user...")
    
    try:
        # Check if admin exists
        existing_admin = await db.users.find_one({"email": "admin@aihub.com"})
        
        if existing_admin:
            print("  ℹ️  Admin user already exists\n")
            return
        
        # Create admin user
        admin_user = {
            "name": "Admin User",
            "email": "admin@aihub.com",
            "password": pwd_context.hash("admin123"),
            "role": "admin",
            "phone": "+91-1234567890",
            "avatar": None,
            "isActive": True,
            "isVerified": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await db.users.insert_one(admin_user)
        
        if result.inserted_id:
            print("  ✅ Admin user created successfully!")
            print("  📧 Email: admin@aihub.com")
            print("  🔑 Password: admin123")
            print("  ⚠️  IMPORTANT: Change password after first login!\n")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")


async def create_sample_users():
    """Create sample users for testing"""
    print("👥 Creating sample users...")
    
    try:
        # Check if sample users already exist
        existing_count = await db.users.count_documents({"email": {"$ne": "admin@aihub.com"}})
        
        if existing_count > 0:
            print("  ℹ️  Sample users already exist\n")
            return
        
        sample_users = [
            {
                "name": "John Farmer",
                "email": "john@farmer.com",
                "password": pwd_context.hash("password123"),
                "role": "farmer",
                "phone": "+91-9876543210",
                "avatar": None,
                "isActive": True,
                "isVerified": True,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            },
            {
                "name": "Dr. Sarah Smith",
                "email": "sarah@doctor.com",
                "password": pwd_context.hash("password123"),
                "role": "doctor",
                "phone": "+91-9876543211",
                "avatar": None,
                "isActive": True,
                "isVerified": True,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            },
            {
                "name": "Emily Green",
                "email": "emily@environment.com",
                "password": pwd_context.hash("password123"),
                "role": "environmentalist",
                "phone": "+91-9876543212",
                "avatar": None,
                "isActive": True,
                "isVerified": True,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            },
            {
                "name": "Test User",
                "email": "test@example.com",
                "password": pwd_context.hash("password123"),
                "role": "user",
                "phone": "+91-9876543213",
                "avatar": None,
                "isActive": True,
                "isVerified": True,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        ]
        
        result = await db.users.insert_many(sample_users)
        
        if result.inserted_ids:
            print(f"  ✅ Created {len(result.inserted_ids)} sample users")
            print("  📧 Emails: john@farmer.com, sarah@doctor.com, emily@environment.com, test@example.com")
            print("  🔑 Password: password123 (for all)\n")
        
    except Exception as e:
        print(f"❌ Error creating sample users: {e}")


async def create_sample_farms():
    """Create sample farm data"""
    print("🌾 Creating sample farms...")
    
    try:
        # Check if farms exist
        existing_count = await db.farms.count_documents({})
        
        if existing_count > 0:
            print("  ℹ️  Sample farms already exist\n")
            return
        
        # Get farmer user
        farmer = await db.users.find_one({"email": "john@farmer.com"})
        
        if not farmer:
            print("  ⚠️  Farmer user not found, skipping farm creation\n")
            return
        
        sample_farms = [
            {
                "userId": farmer["_id"],
                "name": "Green Valley Farm",
                "location": {
                    "latitude": 22.8046,
                    "longitude": 86.2029,
                    "address": "Jamshedpur, Jharkhand"
                },
                "area": 5.5,
                "areaUnit": "acres",
                "crops": ["wheat", "rice", "vegetables"],
                "soilType": "loamy",
                "irrigationType": "drip",
                "status": "active",
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            },
            {
                "userId": farmer["_id"],
                "name": "Sunshine Organic Farm",
                "location": {
                    "latitude": 22.7950,
                    "longitude": 86.1850,
                    "address": "Jamshedpur, Jharkhand"
                },
                "area": 3.2,
                "areaUnit": "acres",
                "crops": ["tomatoes", "cabbage", "beans"],
                "soilType": "sandy",
                "irrigationType": "sprinkler",
                "status": "active",
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        ]
        
        result = await db.farms.insert_many(sample_farms)
        
        if result.inserted_ids:
            print(f"  ✅ Created {len(result.inserted_ids)} sample farms\n")
        
    except Exception as e:
        print(f"❌ Error creating sample farms: {e}")


async def create_sample_appointments():
    """Create sample healthcare appointments"""
    print("📅 Creating sample appointments...")
    
    try:
        # Check if appointments exist
        existing_count = await db.appointments.count_documents({})
        
        if existing_count > 0:
            print("  ℹ️  Sample appointments already exist\n")
            return
        
        # Get doctor and patient users
        doctor = await db.users.find_one({"email": "sarah@doctor.com"})
        patient = await db.users.find_one({"email": "test@example.com"})
        
        if not doctor or not patient:
            print("  ⚠️  Doctor or patient user not found, skipping appointment creation\n")
            return
        
        sample_appointments = [
            {
                "patientId": patient["_id"],
                "doctorId": doctor["_id"],
                "date": datetime.utcnow() + timedelta(days=2),
                "time": "10:00 AM",
                "type": "consultation",
                "status": "scheduled",
                "symptoms": ["fever", "headache"],
                "notes": "General checkup",
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            },
            {
                "patientId": patient["_id"],
                "doctorId": doctor["_id"],
                "date": datetime.utcnow() + timedelta(days=5),
                "time": "2:30 PM",
                "type": "followup",
                "status": "scheduled",
                "symptoms": [],
                "notes": "Follow-up appointment",
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        ]
        
        result = await db.appointments.insert_many(sample_appointments)
        
        if result.inserted_ids:
            print(f"  ✅ Created {len(result.inserted_ids)} sample appointments\n")
        
    except Exception as e:
        print(f"❌ Error creating sample appointments: {e}")


async def create_sample_crop_diseases():
    """Create sample crop disease records"""
    print("🐛 Creating sample crop disease records...")
    
    try:
        # Check if records exist
        existing_count = await db.crop_diseases.count_documents({})
        
        if existing_count > 0:
            print("  ℹ️  Sample crop disease records already exist\n")
            return
        
        # Get farmer user
        farmer = await db.users.find_one({"email": "john@farmer.com"})
        
        if not farmer:
            print("  ⚠️  Farmer user not found, skipping crop disease creation\n")
            return
        
        sample_diseases = [
            {
                "userId": farmer["_id"],
                "imagePath": "/uploads/sample_disease_1.jpg",
                "disease": "Leaf Blight",
                "confidence": 87.5,
                "severity": "medium",
                "treatment": "Apply fungicide and remove affected leaves",
                "detectedAt": datetime.utcnow() - timedelta(days=3),
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            },
            {
                "userId": farmer["_id"],
                "imagePath": "/uploads/sample_disease_2.jpg",
                "disease": "Powdery Mildew",
                "confidence": 92.3,
                "severity": "low",
                "treatment": "Use sulfur-based fungicide",
                "detectedAt": datetime.utcnow() - timedelta(days=1),
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        ]
        
        result = await db.crop_diseases.insert_many(sample_diseases)
        
        if result.inserted_ids:
            print(f"  ✅ Created {len(result.inserted_ids)} sample crop disease records\n")
        
    except Exception as e:
        print(f"❌ Error creating sample crop disease records: {e}")


async def create_settings():
    """Create application settings"""
    print("⚙️  Creating application settings...")
    
    try:
        # Check if settings exist
        existing_settings = await db.settings.find_one({})
        
        if existing_settings:
            print("  ℹ️  Settings already exist\n")
            return
        
        default_settings = {
            "siteName": "Multi-Domain AI Platform",
            "maintenanceMode": False,
            "allowRegistration": True,
            "emailNotifications": True,
            "apiRateLimit": 100,
            "features": {
                "agriculture": True,
                "healthcare": True,
                "environment": True,
                "chatbot": True
            },
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        result = await db.settings.insert_one(default_settings)
        
        if result.inserted_id:
            print("  ✅ Application settings created\n")
        
    except Exception as e:
        print(f"❌ Error creating settings: {e}")


async def create_collections():
    """Create empty collections if they don't exist"""
    print("📦 Creating collections...")
    
    collections_to_create = [
        "users",
        "farms",
        "crops",
        "appointments",
        "patients",
        "doctors",
        "crop_diseases",
        "disease_detections",
        "irrigation_schedules",
        "fertilizer_recommendations",
        "market_forecasts",
        "supply_orders",
        "suppliers",
        "community_posts",
        "automation_logs",
        "carbon_calculations",
        "disaster_alerts",
        "disaster_predictions",
        "wildlife_sightings",
        "conservation_projects",
        "waste_logs",
        "awareness_content",
        "environment_reports",
        "patient_alerts",
        "diagnosis_requests",
        "patient_records",
        "image_analyses",
        "vital_signs",
        "telemedicine_sessions",
        "healthcare_reports",
        "chatbot_logs",
        "reports",
        "sessions",
        "api_logs",
        "access_control",
        "activity_logs",
        "settings"
    ]
    
    existing_collections = await db.list_collection_names()
    
    for collection_name in collections_to_create:
        if collection_name not in existing_collections:
            await db.create_collection(collection_name)
    
    print(f"  ✅ Created/verified {len(collections_to_create)} collections\n")


async def init_database():
    """Main initialization function"""
    print("\n" + "="*60)
    print("🚀 Database Initialization Started")
    print("="*60 + "\n")
    
    try:
        # Test connection
        print("🔄 Testing MongoDB connection...")
        await client.admin.command('ping')
        print("✅ MongoDB connected successfully!\n")
        
        # Create collections
        await create_collections()
        
        # Create indexes
        await create_indexes()
        
        # Create admin user
        await create_admin_user()
        
        # Create sample users
        await create_sample_users()
        
        # Create sample data
        await create_sample_farms()
        await create_sample_appointments()
        await create_sample_crop_diseases()
        
        # Create settings
        await create_settings()
        
        print("="*60)
        print("✨ Database Initialization Completed Successfully!")
        print("="*60)
        print("\n📌 Default Credentials:")
        print("   Email: admin@aihub.com")
        print("   Password: admin123")
        print("\n⚠️  IMPORTANT: Change admin password in production!\n")
        
        # Display statistics
        print("📊 Database Statistics:")
        users_count = await db.users.count_documents({})
        farms_count = await db.farms.count_documents({})
        appointments_count = await db.appointments.count_documents({})
        print(f"   Users: {users_count}")
        print(f"   Farms: {farms_count}")
        print(f"   Appointments: {appointments_count}")
        print()
        
    except Exception as e:
        print(f"\n❌ Error during initialization: {e}")
    finally:
        # Close connection
        client.close()
        print("🔒 Database connection closed")


# Run initialization
if __name__ == "__main__":
    print("\n🎯 Starting Database Initialization...")
    asyncio.run(init_database())
    print("\n✅ Initialization script completed!\n")