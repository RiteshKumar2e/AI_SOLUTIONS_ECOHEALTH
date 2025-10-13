// MedicalImageAnalysis.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  FileImage,
  Send,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, MeshWobbleMaterial } from "@react-three/drei";
import { motion } from "framer-motion";

/*
  Required packages:
    npm install lucide-react framer-motion @react-three/fiber @react-three/drei

  Backend endpoints used (example):
    GET  /api/analyses  -> { recentAnalyses: [...] }
    GET  /api/stats     -> { stats: [...] }
    POST /api/upload    -> multipart/form-data => { analysis: { findings, confidence, ... } }
    POST /api/chat      -> { message } => { reply }
*/

export default function MedicalImageAnalysis() {
  // UI state
  const [selectedScan, setSelectedScan] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // dynamic content from backend
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [stats, setStats] = useState([]);

  // chat
  const [chatMessages, setChatMessages] = useState([
    { id: "sys", from: "bot", text: "Hello — I am your assistant. Ask about analyses or upload an image." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatRef = useRef(null);

  // file input
  const fileRef = useRef(null);

  const scanTypes = [
    { id: "xray", name: "X-Ray", icon: FileImage, color: "#2563eb" },
    { id: "ct", name: "CT Scan", icon: Brain, color: "#7c3aed" },
    { id: "mri", name: "MRI", icon: Brain, color: "#16a34a" },
    { id: "ultrasound", name: "Ultrasound", icon: ImageIcon, color: "#f97316" },
  ];

  useEffect(() => {
    // load analyses
    fetch("/api/analyses")
      .then((r) => r.json())
      .then((d) => {
        if (d?.recentAnalyses) setRecentAnalyses(d.recentAnalyses);
        else fallbackAnalyses();
      })
      .catch(() => fallbackAnalyses());

    // load stats
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d?.stats) setStats(d.stats);
        else fallbackStats();
      })
      .catch(() => fallbackStats());

    function fallbackAnalyses() {
      setRecentAnalyses([
        {
          id: 1,
          patientId: "P-2024-1547",
          type: "Chest X-Ray",
          date: "2025-10-04",
          findings: "No significant abnormalities detected",
          confidence: 94,
          priority: "normal",
        },
        {
          id: 2,
          patientId: "P-2024-1548",
          type: "Brain MRI",
          date: "2025-10-03",
          findings: "Possible lesion detected - requires specialist review",
          confidence: 87,
          priority: "high",
        },
      ]);
    }

    function fallbackStats() {
      setStats([
        { label: "Images Analyzed", value: "12,547", icon: ImageIcon, color: "#2563eb" },
        { label: "Avg. Accuracy", value: "93.5%", icon: Brain, color: "#16a34a" },
        { label: "Processing Time", value: "< 2 min", icon: Clock, color: "#7c3aed" },
        { label: "Cases Flagged", value: "348", icon: AlertCircle, color: "#ef4444" },
      ]);
    }
  }, []);

  // helper for priority badges
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      default:
        return "#10b981";
    }
  };

  // Upload flow - uses /api/upload
  const handleUploadFile = async (file) => {
    if (!selectedScan) {
      alert("Please select a scan type first.");
      return;
    }
    if (!file) return;

    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", selectedScan);

      // Post to backend
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (data?.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        // fallback sample
        setAnalysisResult({ findings: "No result from server", confidence: 0 });
      }

      // refresh recent analyses (non-blocking)
      fetch("/api/analyses")
        .then((r) => r.json())
        .then((d) => d?.recentAnalyses && setRecentAnalyses(d.recentAnalyses))
        .catch(() => {});
    } catch (err) {
      console.error(err);
      setAnalysisResult({ findings: "Upload failed. See console.", confidence: 0 });
    } finally {
      // short delay to give sense of completion
      setTimeout(() => setIsAnalyzing(false), 600);
    }
  };

  // wrapper called by file input
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleUploadFile(f);
  };

  // chat send
  const sendChat = async () => {
    const text = (chatInput || "").trim();
    if (!text) return;
    const userMsg = { id: Date.now() + "-u", from: "user", text };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");

    // show typing indicator
    const typingId = Date.now() + "-typing";
    setChatMessages((m) => [...m, { id: typingId, from: "bot", text: "..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setChatMessages((m) => m.filter((x) => x.id !== typingId));
      setChatMessages((m) => [...m, { id: Date.now() + "-b", from: "bot", text: data?.reply || "Sorry, no reply." }]);
    } catch (e) {
      setChatMessages((m) => m.filter((x) => x.id !== typingId));
      setChatMessages((m) => [...m, { id: Date.now() + "-err", from: "bot", text: "Network error — try again." }]);
    }

    // scroll chat to bottom
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 80);
  };

  // Inline styles (centralized objects to keep JSX readable)
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg,#e6f0ff 0%, #f6e8ff 50%, #ffeef6 100%)",
      padding: 24,
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      color: "#111827",
    },
    container: {
      maxWidth: 1200,
      margin: "0 auto",
      position: "relative",
    },
    headerCard: {
      background: "rgba(255,255,255,0.95)",
      borderRadius: 20,
      padding: 28,
      boxShadow: "0 20px 40px rgba(16,24,40,0.12)",
      marginBottom: 18,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid rgba(0,0,0,0.04)",
    },
    title: { fontSize: 32, fontWeight: 800, margin: 0, color: "#0f172a", lineHeight: 1.05 },
    subtitle: { margin: 0, color: "#374151", marginTop: 6 },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 },
    statCard: { background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 6px 18px rgba(15,23,42,0.06)", border: "1px solid rgba(0,0,0,0.03)" },
    mainGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 18 },
    uploadCard: { background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 6px 20px rgba(15,23,42,0.06)", border: "1px solid rgba(0,0,0,0.04)" },
    scanGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 },
    scanBtn: (active) => ({
      padding: 12,
      borderRadius: 10,
      border: `2px solid ${active ? "#7c3aed" : "#e6e7eb"}`,
      background: active ? "linear-gradient(90deg,#f3e8ff, #ffffff)" : "#fff",
      cursor: "pointer",
      textAlign: "center",
      transition: "all 180ms ease",
      boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.6)" : "none",
    }),
    uploadBox: { border: "2px dashed #d1d5db", borderRadius: 12, padding: 28, textAlign: "center", marginBottom: 12 },
    btnPrimary: (enabled) => ({
      padding: "10px 18px",
      borderRadius: 10,
      background: enabled ? "linear-gradient(90deg,#7c3aed,#2563eb)" : "#e6e7eb",
      color: enabled ? "#fff" : "#9ca3af",
      border: "none",
      cursor: enabled ? "pointer" : "not-allowed",
      fontWeight: 700,
    }),
    progressBox: { background: "#eef2ff", borderLeft: "4px solid #6366f1", padding: 12, borderRadius: 8 },
    analysisBox: { background: "#ecfdf5", borderLeft: "4px solid #10b981", padding: 12, borderRadius: 8 },
    capabilitiesCard: { background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 6px 20px rgba(15,23,42,0.06)", border: "1px solid rgba(0,0,0,0.04)" },
    capabilitiesItem: { borderRadius: 10, padding: 12, marginBottom: 10, background: "linear-gradient(90deg,#faf5ff,#f0f9ff)", border: "1px solid rgba(124,58,237,0.06)" },
    recentCard: { background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 6px 20px rgba(15,23,42,0.06)", border: "1px solid rgba(0,0,0,0.04)", marginBottom: 18 },
    recentItem: { borderRadius: 10, padding: 12, background: "linear-gradient(90deg,#f8fafc,#f1f5f9)", border: "1px solid rgba(0,0,0,0.03)" },
    securityCard: { borderRadius: 12, padding: 18, background: "linear-gradient(90deg,#111827,#374151)", color: "#fff" },
    threeDContainer: { position: "absolute", inset: 0, zIndex: -1, opacity: 0.12, pointerEvents: "none" },
    gridResponsive: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 },
    chatBox: { display: "flex", flexDirection: "column", height: 420 },
    chatList: { flex: 1, overflowY: "auto", padding: 8, display: "flex", flexDirection: "column", gap: 8 },
    chatInputRow: { display: "flex", gap: 8, marginTop: 8 },
    priorityBadge: (color) => ({ padding: "4px 8px", borderRadius: 999, color: "#fff", background: color, fontWeight: 700, fontSize: 12 }),
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* subtle 3D background */}
        <div style={styles.threeDContainer}>
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.65} />
            <directionalLight position={[3, 2, 5]} intensity={0.9} />
            <mesh position={[-2.2, 0.2, -1.8]} rotation={[0.3, 0.8, 0]}>
              <sphereGeometry args={[1.6, 80, 80]} />
              <MeshWobbleMaterial factor={0.4} speed={1.1} roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[2.8, -0.6, -2.5]} rotation={[0.2, -0.5, 0]}>
              <boxGeometry args={[1.8, 1.8, 1.8]} />
              <MeshWobbleMaterial factor={0.35} speed={0.9} roughness={0.5} metalness={0.25} />
            </mesh>
            <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Header */}
        <div style={styles.headerCard}>
          <div>
            <h1 style={styles.title}>AI Medical Image Analysis</h1>
            <p style={styles.subtitle}>Advanced deep learning for diagnostic imaging support</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Brain style={{ width: 60, height: 60, color: "#7c3aed", opacity: 0.95 }} />
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {stats.map((s, i) => {
            const Icon = s.icon || ImageIcon;
            return (
              <motion.div
                key={i}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                style={styles.statCard}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon style={{ width: 28, height: 28, color: s.color || "#374151" }} />
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color || "#111827" }}>{s.value}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* main area: upload + capabilities/chat */}
        <div style={styles.mainGrid}>
          {/* Upload & results */}
          <div style={styles.uploadCard}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Upload Medical Image</h2>

            {/* scan selection */}
            <div style={styles.scanGrid}>
              {scanTypes.map((t) => {
                const Icon = t.icon;
                const active = selectedScan === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedScan(t.id)}
                    style={styles.scanBtn(active)}
                    aria-pressed={active}
                  >
                    <Icon style={{ width: 20, height: 20, color: t.color, display: "block", margin: "0 auto 8px" }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{t.name}</div>
                  </button>
                );
              })}
            </div>

            {/* upload box */}
            <div style={styles.uploadBox}>
              <Upload style={{ width: 56, height: 56, color: "#9ca3af", display: "block", margin: "0 auto 12px" }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                {selectedScan ? `Upload ${scanTypes.find((s) => s.id === selectedScan).name}` : "Select scan type first"}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Drag & drop or click to browse</div>

              <input ref={fileRef} type="file" accept="image/*,application/dicom" style={{ display: "none" }} onChange={onFileChange} />

              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                <button
                  onClick={() => fileRef.current && fileRef.current.click()}
                  disabled={!selectedScan || isAnalyzing}
                  style={styles.btnPrimary(Boolean(selectedScan && !isAnalyzing))}
                >
                  {isAnalyzing ? "Analyzing..." : "Choose file"}
                </button>

                <button
                  onClick={() => {
                    // demo: trigger fake upload with a Blob to show UI
                    if (!selectedScan) return alert("Select scan type first");
                    setIsAnalyzing(true);
                    setAnalysisResult(null);
                    setTimeout(() => {
                      setIsAnalyzing(false);
                      setAnalysisResult({ findings: "Demo: no abnormalities detected", confidence: 92 });
                    }, 1400);
                  }}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e6e7eb",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Demo
                </button>
              </div>
            </div>

            {/* progress or result */}
            <div style={{ display: "grid", gap: 12 }}>
              {isAnalyzing && (
                <div style={styles.progressBox}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Clock style={{ width: 18, height: 18, color: "#4f46e5" }} />
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e293b" }}>AI Analysis in Progress</div>
                      <div style={{ fontSize: 13, color: "#4f46e5" }}>Processing image with deep learning models...</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, height: 8, background: "#e6eefc", borderRadius: 999 }}>
                    <div style={{ width: "64%", height: "100%", background: "#4f46e5", borderRadius: 999, transition: "width 600ms ease" }} />
                  </div>
                </div>
              )}

              {analysisResult && !isAnalyzing && (
                <div style={styles.analysisBox}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <CheckCircle style={{ width: 18, height: 18, color: "#10b981" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: "#065f46" }}>Analysis Complete</div>
                      <div style={{ color: "#065f46", fontSize: 13, marginTop: 6 }}>
                        AI Confidence: <strong>{analysisResult.confidence ?? "—"}%</strong>
                      </div>
                      <div style={{ marginTop: 10, background: "#fff", padding: 10, borderRadius: 8, border: "1px solid rgba(16,185,129,0.08)" }}>
                        <div style={{ fontSize: 14, color: "#065f46" }}>
                          <strong>Findings:</strong> {analysisResult.findings}
                        </div>
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>⚠️ AI provides decision support only. Final diagnosis requires physician review.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column: chat + capabilities */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Chat assistant */}
            <div style={{ ...styles.capabilitiesCard, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Assistant</h3>
                <div style={{ fontSize: 12, color: "#6b7280" }}>AI-powered chat</div>
              </div>

              <div style={styles.chatBox}>
                <div ref={chatRef} style={styles.chatList}>
                  {chatMessages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                        background: m.from === "user" ? "linear-gradient(90deg,#7c3aed,#2563eb)" : "#f3f4f6",
                        color: m.from === "user" ? "#fff" : "#111827",
                        padding: 10,
                        borderRadius: 10,
                        maxWidth: "86%",
                        fontSize: 14,
                      }}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>

                <div style={styles.chatInputRow}>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Ask the assistant (e.g. 'Show high priority cases')"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #e6e7eb",
                      outline: "none",
                    }}
                  />
                  <button onClick={sendChat} style={{ padding: "10px 12px", borderRadius: 10, background: "#111827", color: "#fff", border: "none", display: "flex", alignItems: "center", gap: 8 }}>
                    <Send style={{ width: 16, height: 16, color: "#fff" }} /> Send
                  </button>
                </div>
              </div>

              {/* Capabilities condensed */}
              <div>
                <h4 style={{ margin: "8px 0 6px 0", fontSize: 14, fontWeight: 800 }}>AI Capabilities</h4>
                <div style={{ display: "grid", gap: 8 }}>
                  {[
                    { title: "Fracture Detection", accuracy: 96, description: "Detects bone fractures in X-ray/CT" },
                    { title: "Tumor Recognition", accuracy: 92, description: "Finds potential tumors in MRI/CT" },
                    { title: "Pneumonia Detection", accuracy: 94, description: "Chest X-ray pneumonia indicators" },
                  ].map((c, idx) => (
                    <div key={idx} style={styles.capabilitiesItem}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: 800 }}>{c.title}</div>
                        <div style={{ fontWeight: 800, color: "#6d28d9" }}>{c.accuracy}%</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>{c.description}</div>
                      <div style={{ marginTop: 8, height: 8, background: "#eef2ff", borderRadius: 999 }}>
                        <div style={{ width: `${c.accuracy}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#7c3aed,#2563eb)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent analyses */}
            <div style={styles.recentCard}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: 18, fontWeight: 800 }}>Recent Analyses</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {recentAnalyses.map((r) => (
                  <div key={r.id} style={styles.recentItem}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{r.type}</div>
                        <div style={{ fontSize: 13, color: "#6b7280" }}>Patient: {r.patientId}</div>
                      </div>
                      <div style={styles.priorityBadge(getPriorityColor(r.priority))}>{(r.priority || "normal").toUpperCase()}</div>
                    </div>
                    <div style={{ marginTop: 8, color: "#374151" }}>{r.findings}</div>
                    <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", color: "#6b7280", fontSize: 13 }}>
                      <div>{r.date}</div>
                      <div style={{ fontWeight: 700 }}>Confidence: {r.confidence}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & compliance */}
            <div style={styles.securityCard}>
              <div style={{ display: "flex", gap: 12 }}>
                <Shield style={{ width: 28, height: 28, color: "#fff" }} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>Medical Data Security & Compliance</div>
                  <div style={{ marginTop: 8, color: "#e6e6e6", fontSize: 13 }}>
                    Our AI system adheres to HIPAA and international healthcare data protection standards. Images are encrypted in transit & at rest.
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, fontSize: 13 }}>
                    <div style={{ background: "rgba(255,255,255,0.06)", padding: 8, borderRadius: 8 }}>
                      <div style={{ fontWeight: 800 }}>🔒 HIPAA Compliant</div>
                      <div style={{ color: "#d1d5db" }}>Privacy-first</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", padding: 8, borderRadius: 8 }}>
                      <div style={{ fontWeight: 800 }}>🛡️ E2E Encryption</div>
                      <div style={{ color: "#d1d5db" }}>256-bit AES</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", padding: 8, borderRadius: 8 }}>
                      <div style={{ fontWeight: 800 }}>👨‍⚕️ Physician Oversight</div>
                      <div style={{ color: "#d1d5db" }}>Doctor validation required</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
