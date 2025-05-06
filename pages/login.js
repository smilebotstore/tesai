import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [clicked, setClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: mode === 'signin' ? 'login' : 'signup',
        email,
        password,
      }),
    });

    const data = await res.json();
    setClicked(false);

    if (res.ok) {
      alert(data.message);
    } else {
      setError(data.error || 'Terjadi kesalahan.');
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap');`}
      </style>
      <h1 style={styles.title}>Welcome!</h1>
      <p style={styles.subtitle}>
        {mode === 'signin'
          ? 'Sign in to continue.'
          : 'Create your account to get started.'}
      </p>
      <form onSubmit={handleSubmit} style={{ ...styles.form, marginTop: error ? 20 : 0 }}>
        {error && <div style={styles.alert}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            transform: clicked ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 0.1s ease-in-out',
          }}
        >
          {mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
        </button>
        <p
          onClick={() => {
            setError('');
            setMode(mode === 'signin' ? 'signup' : 'signin');
          }}
          style={styles.toggle}
        >
          {mode === 'signin'
            ? 'Belum punya akun? Sign up di sini'
            : 'Sudah punya akun? Sign in di sini'}
        </p>

        {/* Footer with logo and ©️ text */}
        <div style={styles.footer}>
          <img src="/logo.png" alt="logo" style={styles.logo} />
          <span style={styles.footerText}>©️ Smile Store 2025</span>
        </div>
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
    color: 'black',
    position: 'relative',
  },
  input: {
    marginBottom: '15px',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
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
  toggle: {
    marginTop: '15px',
    textAlign: 'center',
    color: '#2196F3',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  alert: {
    backgroundColor: '#ffdddd',
    color: '#d8000c',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '15px',
    fontSize: '14px',
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '30px',
    justifyContent: 'center',
  },
  logo: {
    width: '24px',
    height: '24px',
    marginRight: '8px',
  },
  footerText: {
    fontSize: '13px',
    color: '#000',
  },
};
