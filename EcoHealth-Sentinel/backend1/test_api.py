# test_api.py - API Testing Script
import requests
import json

BASE_URL = "http://localhost:5000/api"

class APITester:
    def __init__(self):
        self.token = None
        self.user_data = None
    
    def test_health(self):
        print("\n--- Testing Health Check ---")
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    
    def test_register(self):
        print("\n--- Testing User Registration ---")
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "test123",
            "full_name": "Test User",
            "role": "user"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            self.token = result["access_token"]
            self.user_data = result["user"]
            print(f"Token: {self.token[:20]}...")
            print(f"User: {self.user_data}")
            return True
        else:
            print(f"Error: {response.json()}")
            return False
    
    def test_login(self):
        print("\n--- Testing User Login ---")
        data = {
            "email": "admin@aihub.com",
            "password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=data)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            self.token = result["access_token"]
            self.user_data = result["user"]
            print(f"Token: {self.token[:20]}...")
            print(f"User: {self.user_data}")
            return True
        else:
            print(f"Error: {response.json()}")
            return False
    
    def test_admin_dashboard(self):
        print("\n--- Testing Admin Dashboard ---")
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        response = requests.get(f"{BASE_URL}/admin/dashboard", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    
    def test_agriculture_dashboard(self):
        print("\n--- Testing Agriculture Dashboard ---")
        response = requests.get(f"{BASE_URL}/agriculture/dashboard")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    
    def test_crop_disease_detection(self):
        print("\n--- Testing Crop Disease Detection ---")
        # Simulating file upload
        files = {'file': ('test_image.jpg', b'fake image data', 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/agriculture/crop-disease-detection", files=files)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    
    def test_carbon_calculator(self):
        print("\n--- Testing Carbon Calculator ---")
        data = {
            "activity_type": "electricity",
            "value": 100,
            "unit": "kWh"
        }
        response = requests.post(f"{BASE_URL}/environment/carbon-calculator", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    
    def test_schedule_appointment(self):
        print("\n--- Testing Appointment Scheduling ---")
        data = {
            "patient_name": "John Doe",
            "doctor_name": "Dr. Rajesh Kumar",
            "date": "2025-10-15",
            "time": "10:00 AM",
            "reason": "Regular checkup"
        }
        response = requests.post(f"{BASE_URL}/healthcare/appointments", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    
    def test_diagnosis_assistant(self):
        print("\n--- Testing Diagnosis Assistant ---")
        data = {
            "symptoms": ["fever", "cough", "headache"],
            "duration": "3 days",
            "severity": "moderate"
        }
        response = requests.post(f"{BASE_URL}/healthcare/diagnosis-assistant", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    
    def run_all_tests(self):
        print("="*60)
        print("API TESTING SUITE")
        print("="*60)
        
        results = {
            "Health Check": self.test_health(),
            "User Login": self.test_login(),
            "Admin Dashboard": self.test_admin_dashboard(),
            "Agriculture Dashboard": self.test_agriculture_dashboard(),
            "Crop Disease Detection": self.test_crop_disease_detection(),
            "Carbon Calculator": self.test_carbon_calculator(),
            "Schedule Appointment": self.test_schedule_appointment(),
            "Diagnosis Assistant": self.test_diagnosis_assistant()
        }
        
        print("\n" + "="*60)
        print("TEST RESULTS SUMMARY")
        print("="*60)
        for test_name, result in results.items():
            status = "✓ PASS" if result else "✗ FAIL"
            print(f"{test_name}: {status}")
        
        total = len(results)
        passed = sum(results.values())
        print(f"\nTotal: {passed}/{total} tests passed")
        print("="*60)

if __name__ == "__main__":
    tester = APITester()
    tester.run_all_tests()

# DEPLOYMENT.md
"""
# Deployment Guide

## Local Development

1. **Setup Environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**
   Create `.env` file:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://aiadmin:mypassword123@cluster0.n9mmmbt.mongodb.net
   DB_NAME=ai_platform_db
   SECRET_KEY=your-secret-key-here
   ```

3. **Initialize Database**
   ```bash
   python init_database.py
   ```

4. **Run Server**
   ```bash
   python main.py
   # OR
   uvicorn main:app --reload
   ```

5. **Test API**
   ```bash
   python test_api.py
   ```

## Production Deployment

### Option 1: Railway.app

1. Create account on Railway.app
2. Create new project
3. Connect GitHub repository
4. Add MongoDB service or use MongoDB Atlas
5. Set environment variables in Railway dashboard
6. Deploy automatically on push

### Option 2: Render.com

1. Create account on Render.com
2. Create new Web Service
3. Connect GitHub repository
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Deploy

### Option 3: Heroku

1. Install Heroku CLI
2. Create Procfile:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Deploy:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

### Option 4: AWS EC2

1. Launch EC2 instance (Ubuntu)
2. Install dependencies:
   ```bash
   sudo apt update
   sudo apt install python3-pip nginx
   pip3 install -r requirements.txt
   ```
3. Setup Nginx reverse proxy
4. Use systemd or supervisor for process management
5. Configure SSL with Let's Encrypt

### Option 5: Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - SECRET_KEY=${SECRET_KEY}
    restart: always
```

Deploy:
```bash
docker-compose up -d
```

## Frontend Integration

Update your React app's API URL:

```javascript
// In your React app
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Example API call
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
});
```

## Security Best Practices

1. **Change default credentials**
   - Update SECRET_KEY in production
   - Change MongoDB password
   - Update admin password

2. **Enable HTTPS**
   - Use SSL certificates
   - Configure CORS properly

3. **Rate Limiting**
   - Add rate limiting middleware
   - Implement API throttling

4. **Input Validation**
   - Validate all user inputs
   - Sanitize data

5. **Environment Variables**
   - Never commit .env file
   - Use secret management services

## Monitoring

1. **Logging**
   - Add structured logging
   - Use services like Sentry or LogRocket

2. **Performance Monitoring**
   - Monitor API response times
   - Track database queries

3. **Health Checks**
   - Implement /health endpoint
   - Monitor server uptime

## API Endpoints Reference

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/forgot-password
- GET /api/auth/me

### Admin
- GET /api/admin/dashboard
- GET /api/admin/users
- GET /api/admin/analytics
- POST /api/admin/access-control

### Agriculture
- GET /api/agriculture/dashboard
- POST /api/agriculture/crop-disease-detection
- POST /api/agriculture/irrigation/smart-schedule
- POST /api/agriculture/fertilizer/recommendations
- GET /api/agriculture/market/forecast

### Environment
- GET /api/environment/dashboard
- POST /api/environment/carbon-calculator
- GET /api/environment/climate-predictions
- POST /api/environment/disaster-prediction
- GET /api/environment/pollution-heatmap

### Healthcare
- GET /api/healthcare/dashboard
- POST /api/healthcare/appointments
- POST /api/healthcare/diagnosis-assistant
- POST /api/healthcare/medical-image-analysis
- POST /api/healthcare/remote-monitoring

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGO_URI format
   - Verify network access in MongoDB Atlas
   - Ensure IP whitelist is configured

2. **CORS Errors**
   - Update CORS origins in main.py
   - Add frontend URL to allowed origins

3. **Port Already in Use**
   - Change PORT in .env
   - Kill process using the port

4. **Import Errors**
   - Verify all dependencies installed
   - Check Python version (3.8+)

### Support
For issues, check the logs and API documentation at:
- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc
"""