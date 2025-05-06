import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          action: isSignUp ? "signup" : "login",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`${isSignUp ? "Sign Up" : "Login"} successful`);
        // Optional: Redirect after success
        // window.location.href = "/dashboard";
      } else {
        setError(data?.error || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={{ color: "white" }}>{isSignUp ? "Welcome!" : "New here?"}</h2>
        <p style={{ color: "white" }}>
          {isSignUp
            ? "Create your account to get started."
            : "Log in to continue."}
        </p>
        <button onClick={() => setIsSignUp(!isSignUp)} style={styles.toggleButton}>
          {isSignUp ? "SIGN IN" : "SIGN UP"}
        </button>
      </div>

      <div style={styles.formCard}>
        <h2 style={{ textAlign: "center" }}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? "Processing..." : isSignUp ? "SIGN UP" : "LOGIN"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Or sign {isSignUp ? "up" : "in"} with social platforms
        </p>
        <div style={styles.socialRow}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={styles.socialCircle}></div>
          ))}
        </div>
      </div>

      {error && <p style={{ color: "red", marginTop: 20 }}>{error}</p>}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #2196f3 30%, white 30%)",
  },
  header: {
    textAlign: "center",
    marginBottom: 40,
  },
  toggleButton: {
    border: "2px solid white",
    background: "transparent",
    color: "white",
    padding: "10px 25px",
    borderRadius: "25px",
    marginTop: "10px",
    cursor: "pointer",
  },
  formCard: {
    width: "100%",
    maxWidth: "400px",
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "15px",
    borderRadius: "30px",
    border: "none",
    backgroundColor: "#f1f1f1",
    fontSize: "16px",
  },
  submitButton: {
    backgroundColor: "#2196f3",
    color: "white",
    padding: "15px",
    borderRadius: "30px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  socialRow: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "10px",
  },
  socialCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "2px solid black",
  },
};
