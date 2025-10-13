import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === "admin@eco.com" && formData.password === "123") {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      background: "linear-gradient(to bottom right, #1e293b, #0f172a)",
      fontFamily: "'Inter', sans-serif",
      color: "#fff",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      minHeight: "500px",
      backgroundColor: "rgba(50, 60, 80, 0.85)",
      borderRadius: "16px",
      padding: "2.5rem 2rem",
      border: "1px solid #334155",
      backdropFilter: "blur(8px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: "1.5rem",
      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    },
    heading: {
      textAlign: "center",
      fontSize: "1.75rem",
      fontWeight: "700",
      color: "#f1f5f9",
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontSize: "1rem",
      marginBottom: "0.5rem",
      color: "#cbd5e1",
    },
    input: (hasError) => ({
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      border: `1px solid ${hasError ? "#f87171" : "#475569"}`,
      backgroundColor: "rgba(51, 65, 85, 0.5)",
      color: "#fff",
      outline: "none",
      fontSize: "0.95rem",
      transition: "border 0.2s",
    }),
    passwordWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    togglePassword: {
      position: "absolute",
      right: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      fontSize: "0.85rem",
      color: "#3b82f6",
      userSelect: "none",
    },
    error: {
      color: "#f87171",
      fontSize: "0.85rem",
      textAlign: "center",
      marginTop: "0.25rem",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "8px",
      background: "linear-gradient(90deg, #3b82f6, #6366f1)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
      fontSize: "1rem",
      transition: "background 0.3s",
      marginTop: "3rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email field with bottom margin to separate from password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input(!!error && !formData.email)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input(!!error && !formData.password)}
                placeholder="Enter your password"
                required
              />
              <span
                style={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && <p style={styles.error}>{error}</p>}

          {/* Submit button */}
          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
