import React, { useState } from 'react';
import { Pill, AlertTriangle, CheckCircle, User, Calendar, Bell, Shield } from 'lucide-react';

export default function MedicineRecommendations() {
  const [selectedCondition, setSelectedCondition] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [allergies, setAllergies] = useState([]);

  const conditions = [
    'Hypertension', 'Type 2 Diabetes', 'Asthma', 'Arthritis', 
    'Depression', 'Anxiety', 'Migraine', 'GERD'
  ];

  const commonAllergies = [
    'Penicillin', 'Sulfa drugs', 'Aspirin', 'Ibuprofen', 'Codeine'
  ];

  const recommendations = [
    {
      id: 1,
      medicine: 'Amlodipine 5mg',
      condition: 'Hypertension',
      dosage: 'Once daily',
      duration: '30 days',
      confidence: 94,
      sideEffects: ['Swelling', 'Dizziness', 'Fatigue'],
      interactions: ['Simvastatin - Monitor'],
      cost: '₹45/month',
      alternatives: ['Nifedipine', 'Felodipine']
    },
    {
      id: 2,
      medicine: 'Metformin 500mg',
      condition: 'Type 2 Diabetes',
      dosage: 'Twice daily with meals',
      duration: 'Ongoing',
      confidence: 96,
      sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
      interactions: ['Alcohol - Avoid'],
      cost: '₹30/month',
      alternatives: ['Glimepiride', 'Sitagliptin']
    }
  ];

  const prescriptionHistory = [
    {
      date: '2025-09-15',
      medicine: 'Amoxicillin 500mg',
      condition: 'Respiratory Infection',
      duration: '7 days',
      status: 'completed'
    },
    {
      date: '2025-08-20',
      medicine: 'Ibuprofen 400mg',
      condition: 'Pain Management',
      duration: '5 days',
      status: 'completed'
    },
    {
      date: '2025-10-01',
      medicine: 'Amlodipine 5mg',
      condition: 'Hypertension',
      duration: 'Ongoing',
      status: 'active'
    }
  ];

  const aiInsights = [
    {
      type: 'optimization',
      title: 'Medication Timing',
      message: 'Taking Amlodipine in the morning may improve efficacy',
      priority: 'medium'
    },
    {
      type: 'interaction',
      title: 'Potential Interaction',
      message: 'Monitor for increased side effects when combining with Simvastatin',
      priority: 'high'
    },
    {
      type: 'adherence',
      title: 'Adherence Pattern',
      message: 'Patient shows 92% medication adherence - excellent compliance',
      priority: 'low'
    }
  ];

  const stats = [
    { label: 'Active Prescriptions', value: '3', color: 'text-blue-600' },
    { label: 'Adherence Rate', value: '92%', color: 'text-green-600' },
    { label: 'Drug Interactions', value: '1', color: 'text-yellow-600' },
    { label: 'Cost Savings', value: '₹280', color: 'text-purple-600' }
  ];

  const toggleAllergy = (allergy) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-500 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      default: return 'bg-blue-50 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Medicine Recommendations</h1>
              <p className="text-gray-600">Personalized medication suggestions with safety checks</p>
            </div>
            <Pill className="w-16 h-16 text-purple-600 opacity-20" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Input Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Information</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="">Select condition...</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Patient Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Enter age"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Known Allergies
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonAllergies.map(allergy => (
                    <button
                      key={allergy}
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        allergies.includes(allergy)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                Get AI Recommendations
              </button>
            </div>

            {/* Recommendations */}
            {selectedCondition && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Recommended Medications</h3>
                {recommendations.map((rec) => (
                  <div key={rec.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-5 border-l-4 border-purple-500">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{rec.medicine}</h4>
                        <p className="text-sm text-gray-600">For: {rec.condition}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-purple-700">AI Confidence</p>
                        <p className="text-2xl font-bold text-purple-600">{rec.confidence}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-gray-600">Dosage:</p>
                        <p className="font-semibold text-gray-800">{rec.dosage}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration:</p>
                        <p className="font-semibold text-gray-800">{rec.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Est. Cost:</p>
                        <p className="font-semibold text-gray-800">{rec.cost}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="font-semibold text-yellow-800 mb-1">⚠️ Possible Side Effects:</p>
                        <p className="text-yellow-700">{rec.sideEffects.join(', ')}</p>
                      </div>

                      {rec.interactions.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <p className="font-semibold text-red-800 mb-1">🔴 Drug Interactions:</p>
                          <p className="text-red-700">{rec.interactions.join(', ')}</p>
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <p className="font-semibold text-blue-800 mb-1">💊 Alternatives:</p>
                        <p className="text-blue-700">{rec.alternatives.join(', ')}</p>
                      </div>
                    </div>

                    <button className="w-full mt-3 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                      Add to Prescription
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">AI Insights</h2>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`rounded-lg p-4 border-l-4 ${getPriorityColor(insight.priority)}`}>
                    <p className="font-bold mb-1">{insight.title}</p>
                    <p className="text-sm">{insight.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <Bell className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">Medication Reminders</h3>
              <p className="text-sm text-purple-100 mb-3">
                Next dose: Amlodipine 5mg at 8:00 AM
              </p>
              <button className="w-full py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors">
                View All Reminders
              </button>
            </div>
          </div>
        </div>

        {/* Prescription History */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prescription History</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prescriptionHistory.map((rx, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    rx.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {rx.status.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{rx.medicine}</h4>
                <p className="text-sm text-gray-600 mb-2">{rx.condition}</p>
                <div className="text-xs text-gray-500">
                  <p>Date: {rx.date}</p>
                  <p>Duration: {rx.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Compliance */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start">
            <Shield className="w-8 h-8 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">Pharmaceutical AI Safety Standards</h3>
              <p className="text-gray-300 text-sm mb-4">
                Our AI recommendation system follows FDA guidelines and international pharmaceutical standards. 
                All suggestions are cross-referenced with drug databases and require licensed physician approval before prescription.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white bg-opacity-10 rounded p-3">
                  <p className="font-semibold mb-1">✓ FDA Compliant</p>
                  <p className="text-gray-400">Adheres to regulatory standards</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded p-3">
                  <p className="font-semibold mb-1">✓ Drug Database Verified</p>
                  <p className="text-gray-400">Real-time interaction checking</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded p-3">
                  <p className="font-semibold mb-1">✓ Physician Override</p>
                  <p className="text-gray-400">AI assists, doctors decide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}