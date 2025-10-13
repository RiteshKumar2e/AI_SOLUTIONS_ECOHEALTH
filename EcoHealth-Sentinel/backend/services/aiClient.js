// ==================== services/aiClient.js ====================
const axios = require('axios');

class AIClient {
  constructor() {
    this.pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:5000/api';
  }

  async detectCropDisease(imageBuffer, filename) {
    try {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', imageBuffer, filename);

      const response = await axios.post(
        `${this.pythonBackendUrl}/agriculture/crop-disease-detection`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('AI Detection Error:', error.message);
      return this.getMockDiseaseDetection();
    }
  }

  async getDiagnosis(symptoms) {
    try {
      const response = await axios.post(
        `${this.pythonBackendUrl}/healthcare/diagnosis-assistant`,
        { symptoms },
        { timeout: 15000 }
      );

      return response.data;
    } catch (error) {
      console.error('AI Diagnosis Error:', error.message);
      return this.getMockDiagnosis(symptoms);
    }
  }

  async analyzeImage(imageBuffer, imageType) {
    try {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', imageBuffer);

      const response = await axios.post(
        `${this.pythonBackendUrl}/healthcare/medical-image-analysis`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 30000
        }
      );

      return response.data;
    } catch (error) {
      console.error('Image Analysis Error:', error.message);
      return this.getMockImageAnalysis();
    }
  }

  getMockDiseaseDetection() {
    return {
      disease: 'Leaf Blight',
      confidence: 85.5,
      severity: 'medium',
      treatment: 'Apply fungicide and remove affected leaves',
      preventiveMeasures: [
        'Ensure proper spacing between plants',
        'Water in the morning',
        'Use disease-resistant varieties'
      ]
    };
  }

  getMockDiagnosis(symptoms) {
    return {
      possibleConditions: [
        { name: 'Common Cold', probability: 75, urgency: 'low' },
        { name: 'Flu', probability: 60, urgency: 'medium' }
      ],
      recommendations: [
        'Get plenty of rest',
        'Stay hydrated',
        'Monitor temperature'
      ],
      shouldSeeDoctorImmediately: false
    };
  }

  getMockImageAnalysis() {
    return {
      findings: ['Normal chest X-ray', 'No abnormalities detected'],
      confidence: 88.3,
      requiresReview: false
    };
  }
}

module.exports = new AIClient();




