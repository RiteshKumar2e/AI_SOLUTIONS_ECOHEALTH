import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/Landing.jsx";  
import NotFound from "./pages/NotFound.jsx";

// Import Admin Pages
import AccessControl from "./pages/admin/AccessControl.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Users from "./pages/admin/Users.jsx";
import AdLogin from "./pages/admin/AdLogin.jsx";

import AdSettings from "./pages/admin/AdSettings.jsx"; 



// Import Auth Pages
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import MainDashboard from "./pages/auth/MainDashboard.jsx";


// Import Agriculture Modules
import FarmDashboard from "./pages/agriculture/Dashboard.jsx";
import CropDiseaseDetection from "./pages/agriculture/CropDiseaseDetection.jsx";
import WeatherForecast from "./pages/agriculture/WeatherForecast.jsx";
import SmartIrrigation from "./pages/agriculture/SmartIrrigation.jsx";
import FertilizerRecommendations from "./pages/agriculture/FertilizerRecommendations.jsx";
import FarmAutomation from "./pages/agriculture/FarmAutomation.jsx";
import MarketForecast from "./pages/agriculture/MarketForecast.jsx";
import SupplyChain from "./pages/agriculture/SupplyChain.jsx";
import PestControl from "./pages/agriculture/PestControl.jsx";
import ReportsChatbot from "./pages/agriculture/ReportsChatbot.jsx";
import CommunityHub from "./pages/agriculture/CommunityHub.jsx";
import Settings from "./pages/agriculture/Settings.jsx";

// Import Environment Modules
import AwarenessHub from "./pages/environment/AwarenessHub.jsx";
import CarbonCalculator from "./pages/environment/CarbonCalculator.jsx";
import EnvChatbot from "./pages/environment/Chatbot.jsx";
import ClimatePredictions from "./pages/environment/ClimatePredictions.jsx";
import EnvDashboard from "./pages/environment/Dashboard.jsx";
import DisasterPrediction from "./pages/environment/DisasterPrediction.jsx";
import PollutionHeatmap from "./pages/environment/PollutionHeatmap.jsx";
import RenewableEnergy from "./pages/environment/RenewableEnergy.jsx";
import EnvReports from "./pages/environment/Reports.jsx";
import EnvSettings from "./pages/environment/Settings.jsx";
import WasteManagement from "./pages/environment/WasteManagement.jsx";
import WildlifeConservation from "./pages/environment/WildlifeConservation.jsx";

// Import Healthcare Modules
import AppointmentScheduling from "./pages/healthcare/AppointmentScheduling.jsx";
import HealthChatbot from "./pages/healthcare/Chatbot.jsx";
import HealthDashboard from "./pages/healthcare/Dashboard.jsx";
import DiagnosisAssistant from "./pages/healthcare/DiagnosisAssistant.jsx";
import EmergencyPrediction from "./pages/healthcare/EmergencyPrediction.jsx";
import MedicalImageAnalysis from "./pages/healthcare/MedicalImageAnalysis.jsx";
import MedicineRecommendations from "./pages/healthcare/MedicineRecommendations.jsx";
import PatientRecords from "./pages/healthcare/PatientRecords.jsx";
import RemoteMonitoring from "./pages/healthcare/RemoteMonitoring.jsx";
import HealthReports from "./pages/healthcare/Reports.jsx";
import HealthSettings from "./pages/healthcare/Settings.jsx";
import Telemedicine from "./pages/healthcare/Telemedicine.jsx";

// Simple Placeholder Chat Page
const ChatPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 text-xl">
    Chat Page (Coming soon...)
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/dashboard" element={<MainDashboard/>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/login" element={<AdLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/access-control" element={<AccessControl />} />
        <Route path="/admin/settings" element={<AdSettings />} /> 
        
        {/* Agriculture Routes */}
      <Route path="/agriculture/dashboard" element={<FarmDashboard />} />
<Route path="/agriculture/community" element={<CommunityHub />} />
<Route path="/agriculture/crop-disease" element={<CropDiseaseDetection />} />
<Route path="/agriculture/automation" element={<FarmAutomation />} />
<Route path="/agriculture/fertilizer" element={<FertilizerRecommendations />} />
<Route path="/agriculture/market" element={<MarketForecast />} />
<Route path="/agriculture/pest-control" element={<PestControl />} />
<Route path="/agriculture/chatbot" element={<ReportsChatbot />} />
<Route path="/agriculture/irrigation" element={<SmartIrrigation />} />
<Route path="/agriculture/supply-chain" element={<SupplyChain />} />
<Route path="/agriculture/weather" element={<WeatherForecast />} />
<Route path="/agriculture/settings" element={<Settings />} />


        {/* Environment Routes */}
        <Route path="/environment/dashboard" element={<EnvDashboard />} />
        <Route path="/environment/awareness" element={<AwarenessHub />} />
        <Route path="/environment/carbon" element={<CarbonCalculator />} />
        <Route path="/environment/chatbot" element={<EnvChatbot />} />
        <Route path="/environment/climate" element={<ClimatePredictions />} />
        <Route path="/environment/disaster" element={<DisasterPrediction />} />
        <Route path="/environment/pollution" element={<PollutionHeatmap />} />
        <Route path="/environment/renewable" element={<RenewableEnergy />} />
        <Route path="/environment/reports" element={<EnvReports />} />
        <Route path="/environment/settings" element={<EnvSettings />} />
        <Route path="/environment/waste" element={<WasteManagement />} />
        <Route path="/environment/wildlife" element={<WildlifeConservation />} />

        {/* Healthcare Routes */}
        <Route path="/healthcare/dashboard" element={<HealthDashboard />} />
        <Route path="/healthcare/appointments" element={<AppointmentScheduling />} />
        <Route path="/healthcare/chatbot" element={<HealthChatbot />} />
        <Route path="/healthcare/diagnosis" element={<DiagnosisAssistant />} />
        <Route path="/healthcare/emergency" element={<EmergencyPrediction />} />
        <Route path="/healthcare/medical-images" element={<MedicalImageAnalysis />} />
        <Route path="/healthcare/medicine" element={<MedicineRecommendations />} />
        <Route path="/healthcare/patients" element={<PatientRecords />} />
        <Route path="/healthcare/monitoring" element={<RemoteMonitoring />} />
        <Route path="/healthcare/reports" element={<HealthReports />} />
        <Route path="/healthcare/settings" element={<HealthSettings />} />
        <Route path="/healthcare/telemedicine" element={<Telemedicine />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
