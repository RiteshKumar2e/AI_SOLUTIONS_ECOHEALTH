from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "ecohealth_db")

client = None

def connect_db():
    global client
    if client is None:
        client = MongoClient(MONGO_URI)
    return client[DB_NAME]

def close_db():
    global client
    if client:
        client.close()
        client = None

def get_database():
    if client is None:
        connect_db()
    return client[DB_NAME]

def get_collection(collection_name):
    db = get_database()
    return db[collection_name]


# Installation and Running Instructions
"""
1. Create virtual environment:
   python -m venv venv

2. Activate virtual environment:
   Windows: venv\\Scripts\\activate
   Linux/Mac: source venv/bin/activate

3. Install dependencies:
   pip install -r requirements.txt

4. Create .env file with your MongoDB credentials

5. Run the server:
   python main.py
   
   OR
   
   uvicorn main:app --host 0.0.0.0 --port 5000 --reload

6. API Documentation will be available at:
   http://localhost:5000/docs (Swagger UI)
   http://localhost:5000/redoc (ReDoc)

7. Test the API:
   curl http://localhost:5000/api/health
"""