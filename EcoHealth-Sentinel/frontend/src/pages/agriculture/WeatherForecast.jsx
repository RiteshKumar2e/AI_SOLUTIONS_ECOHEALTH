import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, AlertTriangle, TrendingUp, Shield, Loader, MapPin } from 'lucide-react';

const WeatherForecast = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ city: 'Patna', state: 'Bihar', country: 'IN' });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempLocation, setTempLocation] = useState({ city: 'Patna', state: 'Bihar' });

  // Indian states and major cities
  const indianStates = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
    'Delhi': ['New Delhi', 'Delhi'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Karnal'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Manali', 'Kullu', 'Mandi'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Brahmapur'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Rishikesh'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri']
  };

  // OpenWeatherMap API Key - Replace with your actual API key
  const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Get free key from https://openweathermap.org/api
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const [hoverStates, setHoverStates] = useState({
    header: false,
    currentWeather: false,
    forecastCards: {},
    alertCards: {},
    recCards: {},
    aiFeatures: {},
    closeButton: false,
    submitButton: false,
    locationButton: false
  });

  const setHover = (key, value, index = null) => {
    if (index !== null) {
      setHoverStates(prev => ({
        ...prev,
        [key]: { ...prev[key], [index]: value }
      }));
    } else {
      setHoverStates(prev => ({ ...prev, [key]: value }));
    }
  };

  // Fetch weather data from OpenWeatherMap API
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current weather
        const currentResponse = await fetch(
          `${BASE_URL}/weather?q=${location.city},${location.state},${location.country}&units=metric&appid=${API_KEY}`
        );
        
        if (!currentResponse.ok) {
          throw new Error('Failed to fetch weather data. Please check your API key.');
        }

        const currentData = await currentResponse.json();

        // Fetch 7-day forecast
        const forecastResponse = await fetch(
          `${BASE_URL}/forecast?q=${location.city},${location.state},${location.country}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        // Process current weather
        const processedCurrent = {
          temperature: Math.round(currentData.main.temp),
          feelsLike: Math.round(currentData.main.feels_like),
          humidity: currentData.main.humidity,
          windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
          rainfall: currentData.rain ? currentData.rain['1h'] || 0 : 0,
          condition: currentData.weather[0].main,
          description: currentData.weather[0].description,
          uvIndex: 6, // UV data requires separate API call (One Call API)
          icon: currentData.weather[0].icon,
          pressure: currentData.main.pressure,
          visibility: currentData.visibility / 1000 // Convert to km
        };

        setCurrentWeather(processedCurrent);

        // Process 7-day forecast (group by day and take one reading per day)
        const dailyForecasts = [];
        const processedDays = new Set();

        forecastData.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toDateString();

          if (!processedDays.has(dayKey) && dailyForecasts.length < 7) {
            processedDays.add(dayKey);
            dailyForecasts.push({
              day: date.toLocaleDateString('en-US', { weekday: 'short' }),
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              temp: Math.round(item.main.temp),
              condition: item.weather[0].main,
              description: item.weather[0].description,
              rain: item.pop ? Math.round(item.pop * 100) : 0,
              icon: getLocalIcon(item.weather[0].main),
              humidity: item.main.humidity,
              windSpeed: Math.round(item.wind.speed * 3.6)
            });
          }
        });

        setForecast(dailyForecasts);

        // Generate AI-based alerts based on weather data
        const generatedAlerts = generateAlerts(processedCurrent, dailyForecasts);
        setAlerts(generatedAlerts);

        // Generate AI recommendations
        const generatedRecs = generateRecommendations(processedCurrent, dailyForecasts);
        setRecommendations(generatedRecs);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
    
    // Refresh data every 10 minutes
    const interval = setInterval(fetchWeatherData, 600000);
    return () => clearInterval(interval);
  }, [location]);

  // Convert OpenWeather condition to local icon type
  const getLocalIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) return 'sun';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'rain';
    return 'cloud';
  };

  // Generate smart alerts based on weather conditions
  const generateAlerts = (current, forecast) => {
    const alerts = [];

    // Check for heavy rain in forecast
    const rainyDays = forecast.filter(day => day.rain > 50);
    if (rainyDays.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Heavy Rainfall Expected',
        message: `Plan to complete irrigation before ${rainyDays[0].day}. Expected rainfall probability: ${rainyDays[0].rain}%`,
        action: 'Reduce irrigation by 50%',
        severity: 'medium'
      });
    }

    // Check for high temperature
    const hotDays = forecast.filter(day => day.temp > 32);
    if (hotDays.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'High Temperature Alert',
        message: 'Increased water requirements for crops. Monitor soil moisture closely.',
        action: 'Increase irrigation frequency',
        severity: 'medium'
      });
    }

    // Check for good weather window
    const clearDays = forecast.filter(day => day.rain < 20 && day.temp < 30);
    if (clearDays.length >= 3) {
      alerts.push({
        type: 'info',
        title: 'Optimal Harvesting Window',
        message: 'Clear weather expected. Ideal conditions for harvesting and field operations.',
        action: `Schedule harvest for ${clearDays[0].day}-${clearDays[2].day}`,
        severity: 'low'
      });
    }

    // Check for high humidity
    if (current && current.humidity > 80) {
      alerts.push({
        type: 'warning',
        title: 'High Humidity Alert',
        message: 'Increased risk of fungal diseases. Monitor crops closely.',
        action: 'Apply preventive fungicide',
        severity: 'high'
      });
    }

    return alerts.length > 0 ? alerts : [{
      type: 'info',
      title: 'Normal Conditions',
      message: 'Weather conditions are stable. Continue regular farm operations.',
      action: 'Maintain routine schedule',
      severity: 'low'
    }];
  };

  // Generate AI-powered farming recommendations
  const generateRecommendations = (current, forecast) => {
    const recs = [];

    // Irrigation recommendation
    const upcomingRain = forecast.slice(0, 3).some(day => day.rain > 40);
    if (upcomingRain) {
      recs.push({
        title: 'Irrigation',
        advice: 'Pause irrigation for 48-72 hours due to expected rainfall',
        impact: 'Save 300-500L of water',
        icon: Droplets
      });
    } else if (current && current.humidity < 40) {
      recs.push({
        title: 'Irrigation',
        advice: 'Increase irrigation frequency due to low humidity and dry conditions',
        impact: 'Maintain optimal soil moisture',
        icon: Droplets
      });
    } else {
      recs.push({
        title: 'Irrigation',
        advice: 'Continue regular irrigation schedule',
        impact: 'Optimal water usage',
        icon: Droplets
      });
    }

    // Pest control recommendation
    if (current && (current.humidity > 70 || upcomingRain)) {
      recs.push({
        title: 'Pest Control',
        advice: 'Apply organic pest spray before rainfall to prevent fungal growth and pest attacks',
        impact: 'Prevent 30-40% crop damage',
        icon: Shield
      });
    } else {
      recs.push({
        title: 'Pest Control',
        advice: 'Regular monitoring recommended. No immediate action needed.',
        impact: 'Maintain crop health',
        icon: Shield
      });
    }

    // Harvesting recommendation
    const goodHarvestDays = forecast.filter(day => day.rain < 20 && day.temp > 20 && day.temp < 32);
    if (goodHarvestDays.length >= 2) {
      recs.push({
        title: 'Harvesting',
        advice: `Ideal harvesting window: ${goodHarvestDays[0].day} to ${goodHarvestDays[1].day}. Clear and dry conditions.`,
        impact: 'Maximize crop quality',
        icon: TrendingUp
      });
    } else {
      recs.push({
        title: 'Harvesting',
        advice: 'Wait for better weather conditions before harvesting',
        impact: 'Preserve crop quality',
        icon: TrendingUp
      });
    }

    return recs;
  };

  const handleLocationChange = () => {
    setLocation({ ...tempLocation, country: 'IN' });
    setShowLocationModal(false);
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setTempLocation({
      state: newState,
      city: indianStates[newState]?.[0] || ''
    });
  };

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case 'sun': return <Sun style={{ width: '40px', height: '40px', color: '#eab308' }} />;
      case 'cloud': return <Cloud style={{ width: '40px', height: '40px', color: '#6b7280' }} />;
      case 'rain': return <CloudRain style={{ width: '40px', height: '40px', color: '#3b82f6' }} />;
      default: return <Cloud style={{ width: '40px', height: '40px', color: '#6b7280' }} />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return { border: '#ef4444', bg: '#fef2f2' };
      case 'medium': return { border: '#f97316', bg: '#fff7ed' };
      case 'low': return { border: '#3b82f6', bg: '#eff6ff' };
      default: return { border: '#6b7280', bg: '#f9fafb' };
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 50%, #e0f2fe 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundBlob1: {
      position: 'absolute',
      top: '50px',
      left: '-100px',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'float 8s ease-in-out infinite',
      pointerEvents: 'none'
    },
    backgroundBlob2: {
      position: 'absolute',
      top: '200px',
      right: '-150px',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'float 10s ease-in-out infinite 2s',
      pointerEvents: 'none'
    },
    backgroundBlob3: {
      position: 'absolute',
      bottom: '-100px',
      left: '40%',
      width: '450px',
      height: '450px',
      background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      animation: 'float 12s ease-in-out infinite 4s',
      pointerEvents: 'none'
    },
    maxWidth: {
      maxWidth: '1280px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 10
    },
    card: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      padding: '24px',
      marginBottom: '24px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease'
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 25px 35px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.06)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconGlow: {
      position: 'relative',
      display: 'inline-block'
    },
    iconGlowInner: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      filter: 'blur(15px)',
      opacity: 0.5,
      animation: 'pulse 2s ease-in-out infinite'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #2563eb, #06b6d4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: '#4b5563',
      marginTop: '4px'
    },
    currentWeatherCard: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4)',
      padding: '32px',
      marginBottom: '24px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    currentWeatherHover: {
      transform: 'scale(1.02)',
      boxShadow: '0 30px 60px -15px rgba(59, 130, 246, 0.5)'
    },
    currentWeatherOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 60%)',
      pointerEvents: 'none'
    },
    grid: {
      display: 'grid',
      gap: '16px'
    },
    tempDisplay: {
      fontSize: '60px',
      fontWeight: 'bold',
      margin: 0
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '16px',
      transition: 'all 0.3s ease'
    },
    statCardHover: {
      background: 'rgba(255, 255, 255, 0.3)',
      transform: 'scale(1.05)'
    },
    alertCard: {
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      transition: 'all 0.3s ease',
      border: '1px solid transparent'
    },
    alertCardHover: {
      transform: 'translateX(4px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    forecastCard: {
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      background: 'white'
    },
    forecastCardHover: {
      borderColor: '#3b82f6',
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
    },
    recCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.3s ease',
      background: 'white'
    },
    recCardHover: {
      boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-4px)',
      borderColor: '#10b981'
    },
    iconBox: {
      width: '40px',
      height: '40px',
      background: '#dcfce7',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    aiFeatureCard: {
      background: 'linear-gradient(135deg, #059669 0%, #2563eb 100%)',
      borderRadius: '16px',
      boxShadow: '0 25px 50px -12px rgba(5, 150, 105, 0.4)',
      padding: '24px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    aiStatCard: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '16px',
      transition: 'all 0.3s ease'
    },
    aiStatCardHover: {
      background: 'rgba(255, 255, 255, 0.3)',
      transform: 'scale(1.05)'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      gap: '16px'
    },
    errorContainer: {
      background: '#fef2f2',
      border: '2px solid #ef4444',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    },
    closeButtonHover: {
      background: '#f3f4f6',
      color: '#1f2937'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '8px'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#1f2937',
      background: 'white',
      cursor: 'pointer',
      transition: 'border-color 0.2s ease'
    },
    selectFocus: {
      borderColor: '#3b82f6',
      outline: 'none'
    },
    button: {
      width: '100%',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
    },
    buttonPrimaryHover: {
      boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
      transform: 'translateY(-2px)'
    },
    locationButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      background: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#2563eb',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: 500
    },
    locationButtonHover: {
      background: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3b82f6'
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        `}</style>
        <div style={styles.container}>
          <div style={styles.maxWidth}>
            <div style={styles.card}>
              <div style={styles.loadingContainer}>
                <Loader style={{ width: '48px', height: '48px', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '18px', color: '#374151', fontWeight: 600 }}>Loading weather data...</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Fetching real-time data from OpenWeatherMap</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.errorContainer}>
            <AlertTriangle style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 16px' }} />
            <h2 style={{ color: '#991b1b', marginBottom: '8px' }}>Error Loading Weather Data</h2>
            <p style={{ color: '#7f1d1d', marginBottom: '16px' }}>{error}</p>
            <p style={{ fontSize: '14px', color: '#991b1b' }}>
              Please ensure you have a valid OpenWeatherMap API key.<br/>
              Get a free key at: <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>openweathermap.org/api</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @media (min-width: 768px) {
          .grid-md-2 { grid-template-columns: repeat(2, 1fr); }
          .grid-md-3 { grid-template-columns: repeat(3, 1fr); }
          .grid-md-4 { grid-template-columns: repeat(4, 1fr); }
          .grid-md-7 { grid-template-columns: repeat(7, 1fr); }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.backgroundBlob1}></div>
        <div style={styles.backgroundBlob2}></div>
        <div style={styles.backgroundBlob3}></div>

        <div style={styles.maxWidth}>
          {/* Header */}
          <div 
            style={{
              ...styles.card,
              ...(hoverStates.header ? styles.cardHover : {})
            }}
            onMouseEnter={() => setHover('header', true)}
            onMouseLeave={() => setHover('header', false)}
          >
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.iconGlow}>
                  <div style={{...styles.iconGlowInner, background: '#3b82f6'}}></div>
                  <Cloud style={{ width: '32px', height: '32px', color: '#2563eb', position: 'relative', zIndex: 10 }} />
                </div>
                <div>
                  <h1 style={styles.title}>Weather Forecast</h1>
                  <p style={styles.subtitle}>AI-powered predictions for smart farming</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button
                  style={{
                    ...styles.locationButton,
                    ...(hoverStates.locationButton ? styles.locationButtonHover : {})
                  }}
                  onMouseEnter={() => setHover('locationButton', true)}
                  onMouseLeave={() => setHover('locationButton', false)}
                  onClick={() => setShowLocationModal(true)}
                >
                  <MapPin style={{ width: '14px', height: '14px' }} />
                  {location.city}, {location.state}
                </button>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Updated just now</p>
              </div>
            </div>
          </div>

          {/* Current Weather */}
          {currentWeather && (
            <div 
              style={{
                ...styles.currentWeatherCard,
                ...(hoverStates.currentWeather ? styles.currentWeatherHover : {})
              }}
              onMouseEnter={() => setHover('currentWeather', true)}
              onMouseLeave={() => setHover('currentWeather', false)}
            >
              <div style={styles.currentWeatherOverlay}></div>
              <div style={{ ...styles.grid, position: 'relative', zIndex: 10 }} className="grid-md-2">
                <div>
                  <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Current Weather</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={styles.tempDisplay}>{currentWeather.temperature}°C</div>
                    <Cloud style={{ width: '64px', height: '64px' }} />
                  </div>
                  <p style={{ fontSize: '20px', marginBottom: '8px', margin: 0, textTransform: 'capitalize' }}>{currentWeather.description}</p>
                  <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Feels like {currentWeather.feelsLike}°C</p>
                </div>

                <div style={{ ...styles.grid, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <div 
                    style={{
                      ...styles.statCard,
                      ...(hoverStates.stat1 ? styles.statCardHover : {})
                    }}
                    onMouseEnter={() => setHover('stat1', true)}
                    onMouseLeave={() => setHover('stat1', false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Droplets style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontSize: '14px' }}>Humidity</span>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{currentWeather.humidity}%</p>
                  </div>
                  <div 
                    style={{
                      ...styles.statCard,
                      ...(hoverStates.stat2 ? styles.statCardHover : {})
                    }}
                    onMouseEnter={() => setHover('stat2', true)}
                    onMouseLeave={() => setHover('stat2', false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Wind style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontSize: '14px' }}>Wind Speed</span>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{currentWeather.windSpeed} km/h</p>
                  </div>
                  <div 
                    style={{
                      ...styles.statCard,
                      ...(hoverStates.stat3 ? styles.statCardHover : {})
                    }}
                    onMouseEnter={() => setHover('stat3', true)}
                    onMouseLeave={() => setHover('stat3', false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CloudRain style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontSize: '14px' }}>Rainfall</span>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{currentWeather.rainfall} mm</p>
                  </div>
                  <div 
                    style={{
                      ...styles.statCard,
                      ...(hoverStates.stat4 ? styles.statCardHover : {})
                    }}
                    onMouseEnter={() => setHover('stat4', true)}
                    onMouseLeave={() => setHover('stat4', false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Sun style={{ width: '20px', height: '20px' }} />
                      <span style={{ fontSize: '14px' }}>Pressure</span>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{currentWeather.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weather Alerts */}
          {alerts.length > 0 && (
            <div style={styles.card}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle style={{ width: '20px', height: '20px', color: '#ea580c' }} />
                Weather Alerts & AI Advisories
              </h2>
              <div>
                {alerts.map((alert, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.alertCard,
                      borderLeftColor: getAlertColor(alert.severity).border,
                      background: getAlertColor(alert.severity).bg,
                      ...(hoverStates.alertCards[idx] ? styles.alertCardHover : {})
                    }}
                    onMouseEnter={() => setHover('alertCards', true, idx)}
                    onMouseLeave={() => setHover('alertCards', false, idx)}
                  >
                    <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>{alert.title}</h3>
                    <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>{alert.message}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>Action: {alert.action}</span>
                      <span style={{ fontSize: '12px', padding: '4px 12px', background: 'white', borderRadius: '9999px', textTransform: 'capitalize', color: '#374151' }}>{alert.severity} Priority</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-Day Forecast */}
          {forecast.length > 0 && (
            <div style={styles.card}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>7-Day Forecast</h2>
              <div style={{ ...styles.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                {forecast.map((day, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.forecastCard,
                      ...(hoverStates.forecastCards[idx] ? styles.forecastCardHover : {})
                    }}
                    onMouseEnter={() => setHover('forecastCards', true, idx)}
                    onMouseLeave={() => setHover('forecastCards', false, idx)}
                  >
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>{day.day}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>{day.date}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                      {getWeatherIcon(day.icon)}
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '8px 0' }}>{day.temp}°C</p>
                    <p style={{ fontSize: '12px', color: '#4b5563', marginBottom: '8px', textTransform: 'capitalize' }}>{day.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', color: '#3b82f6' }}>
                      <CloudRain style={{ width: '12px', height: '12px' }} />
                      <span>{day.rain}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <div style={styles.card}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield style={{ width: '20px', height: '20px', color: '#059669' }} />
                AI Farming Recommendations
              </h2>
              <div style={{ ...styles.grid }} className="grid-md-3">
                {recommendations.map((rec, idx) => {
                  const Icon = rec.icon;
                  return (
                    <div 
                      key={idx} 
                      style={{
                        ...styles.recCard,
                        ...(hoverStates.recCards[idx] ? styles.recCardHover : {})
                      }}
                      onMouseEnter={() => setHover('recCards', true, idx)}
                      onMouseLeave={() => setHover('recCards', false, idx)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={styles.iconBox}>
                          <Icon style={{ width: '20px', height: '20px', color: '#059669' }} />
                        </div>
                        <h3 style={{ fontWeight: 600, color: '#1f2937', margin: 0 }}>{rec.title}</h3>
                      </div>
                      <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>{rec.advice}</p>
                      <p style={{ fontSize: '12px', color: '#15803d', fontWeight: 600 }}>💡 {rec.impact}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Features */}
          <div style={styles.aiFeatureCard}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.1) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', position: 'relative', zIndex: 10 }}>AI Weather Intelligence</h3>
            <div style={{ ...styles.grid, position: 'relative', zIndex: 10 }} className="grid-md-4">
              <div 
                style={{
                  ...styles.aiStatCard,
                  ...(hoverStates.aiFeatures[0] ? styles.aiStatCardHover : {})
                }}
                onMouseEnter={() => setHover('aiFeatures', true, 0)}
                onMouseLeave={() => setHover('aiFeatures', false, 0)}
              >
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>95%</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Forecast Accuracy</p>
              </div>
              <div 
                style={{
                  ...styles.aiStatCard,
                  ...(hoverStates.aiFeatures[1] ? styles.aiStatCardHover : {})
                }}
                onMouseEnter={() => setHover('aiFeatures', true, 1)}
                onMouseLeave={() => setHover('aiFeatures', false, 1)}
              >
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>7 Days</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Advance Prediction</p>
              </div>
              <div 
                style={{
                  ...styles.aiStatCard,
                  ...(hoverStates.aiFeatures[2] ? styles.aiStatCardHover : {})
                }}
                onMouseEnter={() => setHover('aiFeatures', true, 2)}
                onMouseLeave={() => setHover('aiFeatures', false, 2)}
              >
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>Real-time</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Data Updates</p>
              </div>
              <div 
                style={{
                  ...styles.aiStatCard,
                  ...(hoverStates.aiFeatures[3] ? styles.aiStatCardHover : {})
                }}
                onMouseEnter={() => setHover('aiFeatures', true, 3)}
                onMouseLeave={() => setHover('aiFeatures', false, 3)}
              >
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>Live API</p>
                <p style={{ fontSize: '14px', margin: 0 }}>OpenWeatherMap</p>
              </div>
            </div>
          </div>

          {/* API Info */}
          <div style={{ ...styles.card, background: 'rgba(239, 246, 255, 0.85)', border: '2px solid #93c5fd' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e40af', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cloud style={{ width: '20px', height: '20px' }} />
              Real-Time Weather Data
            </h3>
            <p style={{ fontSize: '14px', color: '#1e3a8a', marginBottom: '8px' }}>
              This app fetches live weather data from <strong>OpenWeatherMap API</strong> and updates automatically every 10 minutes.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#1e40af' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✓</span> Current weather conditions
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✓</span> 7-day forecast
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✓</span> AI-powered recommendations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✓</span> Smart farming alerts
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#3b82f6', marginTop: '12px', padding: '8px', background: 'white', borderRadius: '6px' }}>
              <strong>Note:</strong> Replace 'YOUR_OPENWEATHERMAP_API_KEY' in the code with your actual API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>openweathermap.org</a>
            </p>
          </div>
        </div>
      </div>

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div style={styles.modal} onClick={() => setShowLocationModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Select Location</h2>
              <button
                style={{
                  ...styles.closeButton,
                  ...(hoverStates.closeButton ? styles.closeButtonHover : {})
                }}
                onMouseEnter={() => setHover('closeButton', true)}
                onMouseLeave={() => setHover('closeButton', false)}
                onClick={() => setShowLocationModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLocationChange(); }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>State</label>
                <select
                  style={styles.select}
                  value={tempLocation.state}
                  onChange={handleStateChange}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  {Object.keys(indianStates).sort().map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                <select
                  style={styles.select}
                  value={tempLocation.city}
                  onChange={(e) => setTempLocation({ ...tempLocation, city: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  {indianStates[tempLocation.state]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  ...(hoverStates.submitButton ? styles.buttonPrimaryHover : {})
                }}
                onMouseEnter={() => setHover('submitButton', true)}
                onMouseLeave={() => setHover('submitButton', false)}
              >
                Update Location
              </button>
            </form>

            <div style={{ marginTop: '16px', padding: '12px', background: '#eff6ff', borderRadius: '8px', fontSize: '13px', color: '#1e40af' }}>
              <strong>Note:</strong> Weather data will be fetched for the selected location from OpenWeatherMap API.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherForecast;