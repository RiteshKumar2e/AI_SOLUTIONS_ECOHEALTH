import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Target, TrendingDown, Leaf, AlertCircle, Shield } from 'lucide-react';


export default function FertilizerRecommendations() {
  const [soilData, setSoilData] = useState({
    nitrogen: 45,
    phosphorus: 38,
    potassium: 52,
    ph: 6.8
  });
  const [cropType, setCropType] = useState('tomato');
  const [growthStage, setGrowthStage] = useState('flowering');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For subtle 3D card tilt effect
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top; // y position within element
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx; // -1 .. 1
      const dy = (y - cy) / cy; // -1 .. 1
      const rotateX = (dy * 8).toFixed(2);
      const rotateY = (dx * -8).toFixed(2);
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
    }

    function reset() {
      el.style.transform = '';
    }

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', reset);
    };
  }, []);

  // Try backend first; fallback to local algorithm if backend fails
  async function generateRecommendations() {
    setLoading(true);
    setError(null);
    setRecommendations(null);

    const payload = { soilData, cropType, growthStage };

    // Attempt to POST to backend. Endpoint should implement the same logic server-side.
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Backend error');

      const data = await res.json();
      setRecommendations(data);
      setLoading(false);
      return;
    } catch (e) {
      // Backend failed or not available -> use local fallback (same algorithm you had)
      console.warn('Backend request failed, using local fallback', e);
      const local = computeLocalRecommendations(soilData, cropType, growthStage);
      setRecommendations(local);
      setLoading(false);
    }
  }

  // Local fallback logic (keeps parity with the previous implementation)
  function computeLocalRecommendations(soil, crop, stage) {
    const { nitrogen, phosphorus, potassium, ph } = soil;

    const optimalLevels = {
      tomato: { N: 60, P: 50, K: 60, ph: [6.0, 7.0] },
      wheat: { N: 80, P: 40, K: 40, ph: [6.5, 7.5] },
      rice: { N: 70, P: 35, K: 35, ph: [5.5, 6.5] },
      corn: { N: 85, P: 45, K: 50, ph: [6.0, 7.0] }
    };

    const optimal = optimalLevels[crop];
    const nDef = Math.max(0, optimal.N - nitrogen);
    const pDef = Math.max(0, optimal.P - phosphorus);
    const kDef = Math.max(0, optimal.K - potassium);

    const ureaAmount = Number((nDef * 2.17).toFixed(1));
    const dapAmount = Number((Math.max(nDef, pDef) * 1.8).toFixed(1));
    const mopAmount = Number((kDef * 1.67).toFixed(1));

    const totalCost = (
      ureaAmount * 0.30 +
      dapAmount * 0.45 +
      mopAmount * 0.35
    ).toFixed(2);

    const organicOptions = [];
    if (nDef > 10) organicOptions.push('Compost (5 kg/m²), Vermicompost (3 kg/m²)');
    if (pDef > 10) organicOptions.push('Bone meal (2 kg/m²), Rock phosphate (1.5 kg/m²)');
    if (kDef > 10) organicOptions.push('Wood ash (1 kg/m²), Kelp meal (0.5 kg/m²)');

    const schedule = stage === 'seedling'
      ? 'Split application: 40% at planting, 30% at 3 weeks, 30% at 6 weeks'
      : stage === 'vegetative'
        ? 'Weekly light applications for steady growth'
        : 'Reduce nitrogen, increase potassium for fruit development';

    const co2Saved = organicOptions.length > 0 ? Number((ureaAmount * 0.9).toFixed(1)) : 0;

    return {
      synthetic: { urea: ureaAmount, dap: dapAmount, mop: mopAmount, cost: totalCost },
      organic: organicOptions,
      schedule,
      deficiencies: { nitrogen: nDef, phosphorus: pDef, potassium: kDef },
      phAdjustment: ph < optimal.ph[0] ? 'Add lime to increase pH' : ph > optimal.ph[1] ? 'Add sulfur to decrease pH' : 'pH is optimal',
      environmentalImpact: { co2Saved, waterQuality: 'Precision application reduces runoff by 40%' }
    };
  }

  function getNutrientStatus(current, optimal) {
    const diff = ((current - optimal) / optimal) * 100;
    if (diff < -20) return { status: 'Very Low', color: '#DC2626' };
    if (diff < -10) return { status: 'Low', color: '#F97316' };
    if (diff > 10) return { status: 'High', color: '#2563EB' };
    return { status: 'Optimal', color: '#16A34A' };
  }

  // inline style objects
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%)',
      padding: 24,
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      color: '#0f172a'
    },
    container: { maxWidth: 1100, margin: '0 auto' },
    headerCard: {
      background: '#ffffff',
      borderRadius: 12,
      boxShadow: '0 10px 30px rgba(2,6,23,0.08)',
      padding: 20,
      marginBottom: 18,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr', gap: 20 },
    responsiveTwoCols: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    },
    card: {
      background: '#ffffff',
      borderRadius: 12,
      boxShadow: '0 8px 24px rgba(2,6,23,0.06)',
      padding: 18,
      transformStyle: 'preserve-3d',
      transition: 'transform 300ms ease, box-shadow 300ms ease'
    },
    bigCallout: {
      background: 'linear-gradient(90deg,#059669,#0369a1)',
      borderRadius: 12,
      color: '#fff',
      padding: 18
    },
    slider: { width: '100%' },
    controlRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }
  };

  // tiny visualization: circular nutrient gauge using SVG
  const NutrientGauge = ({ label, value, max = 100 }) => {
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(1, Math.max(0, value / max));
    const stroke = circumference * (1 - pct);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg width={110} height={110} viewBox="0 0 120 120">
          <defs>
            <linearGradient id={`g-${label}`} x1="0%" x2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <g transform="translate(60,60)">
            <circle r={radius} fill="none" stroke="#e6f0ea" strokeWidth={12} />
            <circle
              r={radius}
              fill="none"
              stroke={`url(#g-${label})`}
              strokeWidth={12}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={stroke}
              strokeLinecap="round"
              transform="rotate(-90)"
              style={{ transition: 'stroke-dashoffset 600ms ease' }}
            />
            <text x="0" y="6" textAnchor="middle" fontSize={16} fontWeight={700} fill="#0f172a">
              {Math.round(value)}
            </text>
            <text x="0" y="26" textAnchor="middle" fontSize={10} fill="#475569">
              {label}
            </text>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      {/* small internal stylesheet for keyframes & utility classes (keeps everything inside the file) */}
      <style>{`
        @keyframes floatUp { from { transform: translateY(6px); } to { transform: translateY(-6px); } }
        .pulse { animation: floatUp 3s ease-in-out infinite alternate; }
        .glass { backdrop-filter: blur(6px); }
        .btn { cursor: pointer; }
      `}</style>

      <div style={styles.container}>
        <div style={styles.headerCard}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Sprout style={{ width: 36, height: 36, color: '#059669' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>AI Fertilizer Recommendations</h1>
              <p style={{ margin: 0, marginTop: 4, color: '#64748b', fontSize: 13 }}>Precision nutrition for optimal crop growth</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#059669', fontSize: 13 }}>
            <Shield style={{ width: 18, height: 18 }} />
            <span>Eco-Friendly</span>
          </div>
        </div>

        <div style={styles.responsiveTwoCols}>
          <div>
            <div style={{ ...styles.card, marginBottom: 14 }} ref={cardRef}>
              <h3 style={{ margin: 0, marginBottom: 10, fontSize: 16 }}>Soil Nutrient Levels</h3>

              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155' }}>Nitrogen (N)</label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="100"
                    value={soilData.nitrogen}
                    onChange={(e) => setSoilData({ ...soilData, nitrogen: parseInt(e.target.value) })}
                  />
                  <div style={styles.controlRow}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>0</span>
                    <span style={{ fontWeight: 700 }}>{soilData.nitrogen} ppm</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>100</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155' }}>Phosphorus (P)</label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="100"
                    value={soilData.phosphorus}
                    onChange={(e) => setSoilData({ ...soilData, phosphorus: parseInt(e.target.value) })}
                  />
                  <div style={styles.controlRow}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>0</span>
                    <span style={{ fontWeight: 700 }}>{soilData.phosphorus} ppm</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>100</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155' }}>Potassium (K)</label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="0"
                    max="100"
                    value={soilData.potassium}
                    onChange={(e) => setSoilData({ ...soilData, potassium: parseInt(e.target.value) })}
                  />
                  <div style={styles.controlRow}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>0</span>
                    <span style={{ fontWeight: 700 }}>{soilData.potassium} ppm</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>100</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155' }}>Soil pH</label>
                  <input
                    style={styles.slider}
                    type="range"
                    min="4"
                    max="9"
                    step="0.1"
                    value={soilData.ph}
                    onChange={(e) => setSoilData({ ...soilData, ph: parseFloat(e.target.value) })}
                  />
                  <div style={styles.controlRow}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>4.0</span>
                    <span style={{ fontWeight: 700 }}>{soilData.ph}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>9.0</span>
                  </div>
                </div>

              </div>
            </div>

            <div style={styles.card}>
              <h3 style={{ margin: 0, marginBottom: 8, fontSize: 16 }}>Crop Information</h3>

              <div style={{ display: 'grid', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 6 }}>Crop Type</label>
                  <select value={cropType} onChange={(e) => setCropType(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6eef6' }}>
                    <option value="tomato">Tomato</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="corn">Corn</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 6 }}>Growth Stage</label>
                  <select value={growthStage} onChange={(e) => setGrowthStage(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6eef6' }}>
                    <option value="seedling">Seedling</option>
                    <option value="vegetative">Vegetative</option>
                    <option value="flowering">Flowering</option>
                    <option value="fruiting">Fruiting</option>
                  </select>
                </div>

                <button
                  onClick={generateRecommendations}
                  className="btn"
                  style={{ width: '100%', padding: 12, borderRadius: 10, fontWeight: 700, background: 'linear-gradient(90deg,#059669,#047857)', color: '#fff', border: 'none', marginTop: 4 }}
                >
                  {loading ? 'Generating…' : 'Generate AI Recommendations'}
                </button>

                {error && <div style={{ color: '#b91c1c', fontSize: 13 }}>{error}</div>}

              </div>
            </div>
          </div>

          {/* Results column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Live gauges */}
            <div style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <NutrientGauge label="N" value={soilData.nitrogen} />
                <NutrientGauge label="P" value={soilData.phosphorus} />
                <NutrientGauge label="K" value={soilData.potassium} />
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#475569' }}>pH</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{soilData.ph}</div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'inline-block', padding: '6px 10px', background: '#ecfccb', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    Live Preview
                  </div>
                </div>
              </div>
            </div>

            {/* Results box */}
            <div style={{ ...styles.card, minHeight: 220 }}>
              {recommendations ? (
                <>
                  <h3 style={{ marginTop: 0 }}>Synthetic Fertilizers</h3>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#f0f9ff' }}>
                      <div style={{ fontWeight: 700 }}>Urea (46-0-0)</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{recommendations.synthetic.urea} kg/hectare</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#faf5ff' }}>
                      <div style={{ fontWeight: 700 }}>DAP (18-46-0)</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{recommendations.synthetic.dap} kg/hectare</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, background: '#ecfdf5' }}>
                      <div style={{ fontWeight: 700 }}>MOP (0-0-60)</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{recommendations.synthetic.mop} kg/hectare</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #eef2ff' }}>
                      <div style={{ fontWeight: 800 }}>Estimated Cost</div>
                      <div style={{ fontSize: 18, fontWeight: 900 }}>₹{recommendations.synthetic.cost}</div>
                    </div>
                  </div>

                  <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #eef2ff' }} />

                  <h3 style={{ marginTop: 0 }}>Organic Alternatives</h3>
                  {recommendations.organic.length > 0 ? (
                    <div style={{ display: 'grid', gap: 8 }}>
                      {recommendations.organic.map((opt, i) => (
                        <div key={i} style={{ padding: 10, borderRadius: 8, background: '#f0fdf4', borderLeft: '4px solid #059669' }}>{opt}</div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: 10, borderRadius: 8, background: '#ecfeff' }}>Current nutrient levels are adequate. Maintain with compost.</div>
                  )}

                </>
              ) : (
                <div style={{ textAlign: 'center', paddingTop: 28, color: '#94a3b8' }}>
                  <Sprout style={{ width: 48, height: 48 }} className="pulse" />
                  <div style={{ marginTop: 8 }}>Enter soil data and crop information.</div>
                  <div style={{ fontSize: 12, marginTop: 6 }}>AI will generate personalized recommendations.</div>
                </div>
              )}
            </div>

            {/* Environmental card with 3D tilt subtle gradient */}
            <div style={{ ...styles.bigCallout, borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingDown style={{ width: 18, height: 18 }} /> Environmental Impact
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13 }}>{recommendations ? `${recommendations.environmentalImpact.co2Saved} kg CO₂ saved (organic option)` : 'Switch to organic supplements to reduce emissions.'}</div>
                </div>

                <div style={{ width: 90, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* a small animated icon / globe substitute */}
                  <div style={{ width: 52, height: 52, borderRadius: 10, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(10deg)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                    🌱
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Benefits footer */}
        <div style={{ marginTop: 18, padding: 16, borderRadius: 10, background: 'rgba(239,250,255,0.7)', border: '1px solid #e6f0ff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800 }}>Precision Nutrition</div>
              <div style={{ fontSize: 13, color: '#475569' }}>Apply exactly what crops need, when they need it</div>
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>Cost Savings</div>
              <div style={{ fontSize: 13, color: '#475569' }}>Reduce fertilizer waste by 30-40%</div>
            </div>
            <div>
              <div style={{ fontWeight: 800 }}>Environmental Protection</div>
              <div style={{ fontSize: 13, color: '#475569' }}>Minimize runoff and groundwater contamination</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
