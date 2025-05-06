import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          action: isSignUp ? "signup" : "login",
        }),
      });

      const data = await res.json();
      if (res.status === 200) {
        alert(`${isSignUp ? "Sign Up" : "Login"} successful`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred.");
    }
  };

  return (
    <div style={{
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #2196f3 30%, white 30%)",
    }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ color: "white" }}>{isSignUp ? "Welcome!" : "New here?"}</h2>
        <p style={{ color: "white" }}>
          {isSignUp
            ? "Create your account to get started."
            : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio minus natus est."}
        </p>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            border: "2px solid white",
            background: "transparent",
            color: "white",
            padding: "10px 25px",
            borderRadius: "25px",
            marginTop: "10px",
            cursor: "pointer"
          }}
        >
          {isSignUp ? "SIGN IN" : "SIGN UP"}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "400px", background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "15px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#f1f1f1",
              fontSize: "16px"
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "15px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#f1f1f1",
              fontSize: "16px"
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#2196f3",
              color: "white",
              padding: "15px",
              borderRadius: "30px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {isSignUp ? "SIGN UP" : "LOGIN"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px" }}>Or Sign {isSignUp ? "up" : "in"} with social platforms</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "2px solid black"
            }}></div>
          ))}
        </div>
      </div>

      {error && <p style={{ color: "red", marginTop: 20 }}>{error}</p>}
    </div>
  );
              }
