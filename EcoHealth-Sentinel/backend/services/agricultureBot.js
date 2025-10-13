// ==================== services/agricultureBot.js ====================
class AgricultureBot {
  async getResponse(message, context = {}) {
    const lowerMessage = message.toLowerCase();

    // Intent recognition
    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast')) {
      return this.getWeatherResponse(context);
    } else if (lowerMessage.includes('disease') || lowerMessage.includes('pest')) {
      return this.getDiseaseResponse();
    } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
      return this.getFertilizerResponse();
    } else if (lowerMessage.includes('irrigation') || lowerMessage.includes('water')) {
      return this.getIrrigationResponse();
    } else if (lowerMessage.includes('market') || lowerMessage.includes('price')) {
      return this.getMarketResponse();
    } else {
      return this.getDefaultResponse();
    }
  }

  getWeatherResponse(context) {
    return {
      message: `Current weather conditions for your farm:\n\n` +
               `🌡️ Temperature: 28°C\n` +
               `💧 Humidity: 65%\n` +
               `🌧️ Rainfall forecast: 40% chance in next 24 hours\n\n` +
               `Recommendation: Consider delaying irrigation if rain is expected.`,
      actions: ['View 7-day forecast', 'Set weather alerts'],
      confidence: 0.95
    };
  }

  getDiseaseResponse() {
    return {
      message: `I can help you identify crop diseases! 🌱\n\n` +
               `Please upload a clear photo of the affected plant part. ` +
               `I'll analyze it and provide:\n\n` +
               `✓ Disease identification\n` +
               `✓ Treatment recommendations\n` +
               `✓ Prevention tips\n\n` +
               `You can also describe the symptoms if you prefer.`,
      actions: ['Upload Photo', 'Describe Symptoms', 'Common Diseases'],
      confidence: 0.92
    };
  }

  getFertilizerResponse() {
    return {
      message: `Fertilizer recommendations based on your crop:\n\n` +
               `For optimal growth, I recommend:\n` +
               `🌱 NPK ratio: 19-19-19\n` +
               `📏 Application rate: 200kg per hectare\n` +
               `📅 Timing: Split application - 50% at planting, 25% at 30 days, 25% at 60 days\n\n` +
               `Would you like specific recommendations for your crop type?`,
      actions: ['Get Crop-Specific Plan', 'Organic Alternatives', 'Schedule Application'],
      confidence: 0.88
    };
  }

  getIrrigationResponse() {
    return {
      message: `Smart irrigation guidance: 💧\n\n` +
               `Based on current conditions:\n` +
               `• Soil moisture: 55% (Good)\n` +
               `• Next irrigation: 2 days\n` +
               `• Recommended amount: 25mm\n\n` +
               `I can help you set up automated irrigation schedules!`,
      actions: ['Create Schedule', 'Soil Analysis', 'Water Usage Stats'],
      confidence: 0.90
    };
  }

  getMarketResponse() {
    return {
      message: `Current market insights: 📊\n\n` +
               `Recent price trends:\n` +
               `🌾 Wheat: ₹2,150/quintal (↑ 3%)\n` +
               `🌽 Corn: ₹1,850/quintal (↓ 1%)\n` +
               `🍚 Rice: ₹3,200/quintal (→ stable)\n\n` +
               `Best time to sell: Next 2 weeks based on forecast`,
      actions: ['Price Alerts', 'Demand Forecast', 'Nearby Markets'],
      confidence: 0.85
    };
  }

  getDefaultResponse() {
    return {
      message: `Hello! I'm your Agriculture AI Assistant. 🌾\n\n` +
               `I can help you with:\n` +
               `• Weather forecasts and alerts\n` +
               `• Crop disease detection\n` +
               `• Fertilizer recommendations\n` +
               `• Irrigation scheduling\n` +
               `• Market price updates\n` +
               `• Pest control advice\n\n` +
               `What would you like to know?`,
      actions: ['Weather', 'Disease Detection', 'Market Prices', 'Irrigation'],
      confidence: 1.0
    };
  }
}

module.exports = new AgricultureBot();