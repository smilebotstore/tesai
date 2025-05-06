import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Login successful!');
      // redirect or store token
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap');`}
      </style>
      <h1 style={styles.title}>Welcome!</h1>
      <p style={styles.subtitle}>Create your account to get started.</p>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={styles.button}>SIGN IN</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Cal Sans', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '50px',
    backgroundColor: '#2196F3',
    height: '100vh',
    color: '#fff',
  },
  title: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  subtitle: {
    marginBottom: '20px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    maxWidth: '400px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
  },
  input: {
    marginBottom: '15px',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
    color: 'black',
    fontFamily: "'Cal Sans', sans-serif",
  },
  button: {
    padding: '15px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: "'Cal Sans', sans-serif",
  },
};
