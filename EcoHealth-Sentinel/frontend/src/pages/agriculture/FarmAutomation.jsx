import React, { useEffect, useRef, useState, useMemo } from "react";
import { Power, Zap, Clock, Activity, Shield, Send, TrendingUp } from "lucide-react";

const SENSOR_COLORS = {
  irrigation: "#2DD4BF",
  fertilizer: "#FBBF24",
  pest: "#FB7185",
  sensor: "#60A5FA",
};

const FarmAutomation = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Irrigation System A",
      type: "irrigation",
      status: "active",
      mode: "auto",
      schedule: "6:00 AM - 8:00 AM",
      waterFlow: 45,
      energyUsage: 2.3,
      aiOptimized: true,
    },
    {
      id: 2,
      name: "Fertilizer Dispenser",
      type: "fertilizer",
      status: "idle",
      mode: "auto",
      schedule: "Every 3 days",
      lastRun: "2 days ago",
      energyUsage: 0.5,
      aiOptimized: true,
    },
    {
      id: 3,
      name: "Pest Control Sprayer",
      type: "pest",
      status: "idle",
      mode: "manual",
      schedule: "As needed",
      lastRun: "5 days ago",
      energyUsage: 0,
      aiOptimized: false,
    },
    {
      id: 4,
      name: "Weather Station",
      type: "sensor",
      status: "active",
      mode: "auto",
      temperature: 28,
      humidity: 72,
      energyUsage: 0.1,
      aiOptimized: true,
    },
  ]);

  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      condition: "Soil moisture < 50%",
      action: "Activate irrigation for 30 minutes",
      enabled: true,
      triggered: 12,
    },
    {
      id: 2,
      condition: "Temperature > 35°C",
      action: "Increase irrigation by 20%",
      enabled: true,
      triggered: 3,
    },
    {
      id: 3,
      condition: "Disease detected",
      action: "Send alert + Schedule treatment",
      enabled: true,
      triggered: 1,
    },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: "bot-1", author: "bot", text: "Hello! I'm your farm automation assistant. Ask me about device status, energy optimization, or automation rules." },
  ]);
  const [chatText, setChatText] = useState("");
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const chatListRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        const res = await fetch("/api/devices");
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json)) setDevices(json);
        }
      } catch (e) {
        console.log('Using local device data');
      } finally {
        if (mounted) setLoadingDevices(false);
      }
    };
    fetchDevices();
    const id = setInterval(fetchDevices, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleDevice = (deviceId) =>
    setDevices((ds) =>
      ds.map((device) =>
        device.id === deviceId ? { ...device, status: device.status === "active" ? "idle" : "active" } : device
      )
    );

  const toggleMode = (deviceId) =>
    setDevices((ds) => ds.map((device) => (device.id === deviceId ? { ...device, mode: device.mode === "auto" ? "manual" : "auto" } : device)));

  const toggleRule = (ruleId) => setAutomationRules((rs) => rs.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)));

  const sendMessageToBot = async (messageText) => {
    if (!messageText || messageText.trim() === "") return;

    const userId = `user-${Date.now()}`;
    setChatMessages((m) => [...m, { id: userId, author: "you", text: messageText }]);
    setChatText("");
    setIsTyping(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: messageText }));
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: messageText,
          context: {
            devices: devices.map(d => ({ id: d.id, name: d.name, status: d.status, type: d.type })),
            rules: automationRules.map(r => ({ condition: r.condition, enabled: r.enabled }))
          }
        }),
      });
      const json = await (res.ok ? res.json() : Promise.resolve({ reply: "Sorry, chat service unavailable." }));
      setIsTyping(false);
      setChatMessages((m) => [...m, { id: `bot-${Date.now()}`, author: "bot", text: json.reply || String(json) }]);
    } catch (err) {
      setIsTyping(false);
      setChatMessages((m) => [...m, { id: `bot-${Date.now()}`, author: "bot", text: "Network error: cannot reach chat backend." }]);
    }
  };

  const handleChatKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessageToBot(chatText.trim());
    }
  };

  const totalEnergy = useMemo(() => 
    devices.reduce((s, d) => s + (Number(d.energyUsage) || 0), 0),
    [devices]
  );

  const activeDevices = useMemo(() => 
    devices.filter(d => d.status === 'active').length,
    [devices]
  );

  return (
    <div style={{ minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif', background: 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), linear-gradient(180deg, #0a0f1e 0%, #141b2e 100%)', color: '#e2e8f0', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes statusPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        
        .glass-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(99, 102, 241, 0.2);
        }
      `}</style>
      
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 28, position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div className="glass-card" style={{ gridColumn: '1 / span 2', padding: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',}} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <Zap style={{ width: 40, height: 40, color: '#6366f1', filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.6))' }} />
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: -0.5, margin: 0 }}>Farm Automation</h1>
              <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>AI-driven device control with real-time monitoring</p>
            </div>
          </div>
          
          <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Total Energy</div>
            <div style={{ fontSize: 42, fontWeight: 800, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{totalEnergy.toFixed(1)} kW</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>{activeDevices} of {devices.length} devices active</div>
          </div>
        </div>
        
        {/* Left: Devices */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {devices.map((device) => (
            <div key={device.id} className="glass-card" style={{ padding: 24, position: 'relative', overflow: 'hidden', borderLeft: `4px solid ${SENSOR_COLORS[device.type]}` }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: `radial-gradient(circle, ${SENSOR_COLORS[device.type]}20 0%, transparent 70%)`, animation: 'pulseGlow 3s ease-in-out infinite' }} />
              
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: device.status === 'active' ? '#22c55e' : '#64748b', boxShadow: device.status === 'active' ? '0 0 20px rgba(34, 197, 94, 0.6)' : 'none', animation: device.status === 'active' ? 'statusPulse 2s infinite' : 'none' }} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{device.name}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{device.type}</div>
                  </div>
                </div>
                
                {device.aiOptimized && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 999, fontSize: 11, fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase' }}>
                    <Shield style={{ width: 12, height: 12 }} />
                    AI
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 20, position: 'relative', zIndex: 1 }}>
                <button onClick={() => toggleDevice(device.id)} style={{ flex: 1, padding: '12px 20px', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: device.status === 'active' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(51, 65, 85, 0.8)', color: device.status === 'active' ? 'white' : '#cbd5e1', boxShadow: device.status === 'active' ? '0 4px 20px rgba(34, 197, 94, 0.3)' : 'none', transition: 'all 0.3s ease' }}>
                  {device.status === 'active' ? 'Turn Off' : 'Turn On'}
                </button>
                
                <button onClick={() => toggleMode(device.id)} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', border: 'none', cursor: 'pointer', background: device.mode === 'auto' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(51, 65, 85, 0.8)', color: device.mode === 'auto' ? 'white' : '#94a3b8', transition: 'all 0.3s ease' }}>
                  {device.mode}
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', zIndex: 1 }}>
                {device.waterFlow && (
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{device.waterFlow} L/min</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Water Flow</div>
                    <div style={{ height: 6, background: 'linear-gradient(90deg, #2dd4bf 0%, #6366f1 100%)', borderRadius: 999, marginTop: 8, position: 'relative', overflow: 'hidden', width: `${Math.min(100, device.waterFlow)}%` }}>
                      <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)', animation: 'shimmer 2s infinite' }} />
                    </div>
                  </div>
                )}
                
                {device.temperature && (
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{device.temperature}°C</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Temperature</div>
                  </div>
                )}
                
                {device.humidity && (
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{device.humidity}%</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Humidity</div>
                  </div>
                )}
                
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{device.energyUsage} kW</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Energy</div>
                </div>
                
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{device.schedule}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Schedule</div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Rules */}
          <div className="glass-card" style={{ gridColumn: '1 / span 2', padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <TrendingUp style={{ width: 24, height: 24, color: '#6366f1' }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>AI Automation Rules</h2>
            </div>
            
            {automationRules.map((rule) => (
              <div key={rule.id} style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: 16, padding: 20, marginBottom: 16, border: '1px solid rgba(255, 255, 255, 0.05)', borderLeft: rule.enabled ? '3px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>IF: {rule.condition}</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>THEN: {rule.action}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Triggered {rule.triggered}x</div>
                </div>
                
                <button onClick={() => toggleRule(rule.id)} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: rule.enabled ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(51, 65, 85, 0.8)', color: rule.enabled ? 'white' : '#94a3b8', fontWeight: 700, fontSize: 12, transition: 'all 0.3s ease' }}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right: Chat & Impact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Impact */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Automation Impact</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { value: '60%', label: 'Labor Saved' },
                { value: '35%', label: 'Energy Efficiency' },
                { value: '24/7', label: 'Monitoring' },
                { value: 'Zero', label: 'Human Errors' }
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: 16, padding: 20, textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.3s ease' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8 }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chat */}
          <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: 500 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>Assistant</h3>
            
            <div ref={chatListRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, padding: '0 4px' }}>
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{ maxWidth: '80%', padding: '14px 18px', borderRadius: 16, fontSize: 14, lineHeight: 1.5, animation: 'slideIn 0.3s ease', alignSelf: msg.author === 'you' ? 'flex-end' : 'flex-start', background: msg.author === 'you' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(30, 41, 59, 0.8)', color: msg.author === 'you' ? 'white' : '#e2e8f0', border: msg.author === 'bot' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none', boxShadow: msg.author === 'you' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none' }}>
                  {msg.text}
                </div>
              ))}
              
              {isTyping && (
                <div style={{ display: 'flex', gap: 4, padding: '14px 18px', alignSelf: 'flex-start', background: 'rgba(30, 41, 59, 0.8)', borderRadius: 16, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', animation: 'bounce 1.4s infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <textarea value={chatText} onChange={(e) => setChatText(e.target.value)} onKeyDown={handleChatKey} placeholder="Ask about devices or energy..." style={{ flex: 1, background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: '14px 18px', color: '#e2e8f0', fontSize: 14, resize: 'none', outline: 'none', transition: 'all 0.3s ease', fontFamily: 'inherit' }} rows={2} />
              
              <button onClick={() => sendMessageToBot(chatText.trim())} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', borderRadius: 12, padding: '0 20px', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center' }}>
                <Send style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmAutomation;