// ==================== services/environmentBot.js ====================
class EnvironmentBot {
  async getResponse(message, context = {}) {
    const lowerMessage = message.toLowerCase();

    // Intent recognition
    if (lowerMessage.includes('carbon') || lowerMessage.includes('footprint')) {
      return this.getCarbonResponse();
    } else if (lowerMessage.includes('recycle') || lowerMessage.includes('waste')) {
      return this.getWasteResponse();
    } else if (lowerMessage.includes('disaster') || lowerMessage.includes('alert')) {
      return this.getDisasterResponse();
    } else if (lowerMessage.includes('pollution') || lowerMessage.includes('air quality')) {
      return this.getPollutionResponse();
    } else if (lowerMessage.includes('wildlife') || lowerMessage.includes('conservation')) {
      return this.getWildlifeResponse();
    } else if (lowerMessage.includes('energy') || lowerMessage.includes('renewable')) {
      return this.getEnergyResponse();
    } else {
      return this.getDefaultResponse();
    }
  }

  getCarbonResponse() {
    return {
      message: `Let's calculate your carbon footprint! 🌍\n\n` +
               `I'll need some information:\n` +
               `• Daily commute distance and mode\n` +
               `• Home energy consumption\n` +
               `• Dietary preferences\n` +
               `• Air travel frequency\n\n` +
               `Average footprint in India: 1.9 tons CO2/year\n` +
               `Would you like to start the assessment?`,
      actions: ['Start Calculator', 'View Tips', 'Offset Options'],
      confidence: 0.94
    };
  }

  getWasteResponse() {
    return {
      message: `Smart waste management tips! ♻️\n\n` +
               `Waste segregation guide:\n` +
               `🟢 Wet Waste: Food scraps, garden waste\n` +
               `🔵 Dry Waste: Paper, plastic, metal\n` +
               `🔴 Hazardous: Batteries, chemicals, e-waste\n\n` +
               `Your monthly waste: 45 kg\n` +
               `Recycling rate: 68% (Good!)\n\n` +
               `Tip: You could reduce 12 kg by composting!`,
      actions: ['Recycling Guide', 'Find E-waste Center', 'Composting Tips'],
      confidence: 0.92
    };
  }

  getDisasterResponse() {
    return {
      message: `Disaster alerts and predictions: 🚨\n\n` +
               `Current alerts in your area:\n` +
               `✓ No active alerts\n\n` +
               `Recent predictions:\n` +
               `• Heavy rainfall: 70% chance (next 48 hours)\n` +
               `• Flood risk: Low\n` +
               `• Air quality: Moderate\n\n` +
               `Would you like to:\n` +
               `• Set up custom alerts?\n` +
               `• View emergency preparedness guide?`,
      actions: ['Set Alerts', 'Emergency Kit', 'Evacuation Routes'],
      confidence: 0.89
    };
  }

  getPollutionResponse() {
    return {
      message: `Air Quality Information: 🌫️\n\n` +
               `Current AQI in your area: 156 (Unhealthy)\n\n` +
               `Pollutant levels:\n` +
               `• PM2.5: 78 µg/m³ (High)\n` +
               `• PM10: 145 µg/m³ (Moderate)\n` +
               `• NO2: 42 ppb (Good)\n\n` +
               `Recommendations:\n` +
               `⚠️ Limit outdoor activities\n` +
               `😷 Wear mask if going outside\n` +
               `🏠 Keep windows closed`,
      actions: ['View Heatmap', 'Set AQI Alerts', 'Nearby Stations'],
      confidence: 0.91
    };
  }

  getWildlifeResponse() {
    return {
      message: `Wildlife conservation insights: 🦁\n\n` +
               `Recent sightings in your area:\n` +
               `• Indian Elephant - 12 km away\n` +
               `• Bengal Tiger - Protected area\n` +
               `• Various bird species\n\n` +
               `Active conservation projects:\n` +
               `🌳 Tree plantation drive (Join now!)\n` +
               `🐘 Elephant corridor protection\n` +
               `🦜 Bird sanctuary development\n\n` +
               `Want to contribute?`,
      actions: ['Report Sighting', 'Join Project', 'Donate'],
      confidence: 0.88
    };
  }

  getEnergyResponse() {
    return {
      message: `Renewable energy information: ⚡\n\n` +
               `Your area's renewable energy stats:\n` +
               `☀️ Solar potential: High (5.2 kWh/m²/day)\n` +
               `💨 Wind potential: Moderate\n` +
               `💧 Hydro: Available nearby\n\n` +
               `For a typical home:\n` +
               `• Solar panel cost: ₹75,000-1,00,000\n` +
               `• Payback period: 4-5 years\n` +
               `• Annual savings: ₹18,000\n\n` +
               `Interested in switching?`,
      actions: ['Solar Calculator', 'Find Installers', 'Govt Subsidies'],
      confidence: 0.90
    };
  }

  getDefaultResponse() {
    return {
      message: `Hello! I'm your Environment AI Assistant. 🌱\n\n` +
               `I can help you with:\n` +
               `• Carbon footprint calculation\n` +
               `• Waste management & recycling\n` +
               `• Disaster alerts & predictions\n` +
               `• Air quality monitoring\n` +
               `• Wildlife conservation\n` +
               `• Renewable energy info\n\n` +
               `How can I help protect our planet today?`,
      actions: ['Carbon Calc', 'Waste Guide', 'AQI Check', 'Alerts'],
      confidence: 1.0
    };
  }
}

module.exports = new EnvironmentBot();

