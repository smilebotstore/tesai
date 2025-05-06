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
        // Redirect or show success message
        console.log(data);
        alert("Authentication successful");
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>{isSignUp ? "Create Account" : "Login"}</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ghost"
          >
            {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
        }
