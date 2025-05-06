import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [btnClicked, setBtnClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    if (password.length < 6) {
      setError('Password harus minimal 6 karakter');
      return;
    }

    setBtnClicked(true);
    setTimeout(() => setBtnClicked(false), 200); // reset animasi

    const res = await fetch('/api/auth.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: mode,
        email,
        password
      }),
    });

    const data = await res.json();
    alert(data.message || (mode === 'signin' ? 'Login berhasil!' : 'Akun berhasil dibuat!'));
  };

  return (
    <div style={styles.container}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap');`}
      </style>
      <h1 style={styles.title}>Welcome!</h1>
      <p style={styles.subtitle}>
        {mode === 'signin' ? 'Sign in to continue.' : 'Create your account to get started.'}
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            transform: btnClicked ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 0.2s ease',
          }}
        >
          {mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
        </button>
        <p onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} style={styles.toggle}>
          {mode === 'signin' ? 'Belum punya akun? Sign up di sini' : 'Sudah punya akun? Sign in di sini'}
        </p>
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
  toggle: {
    marginTop: '15px',
    textAlign: 'center',
    color: '#2196F3',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    marginBottom: '15px',
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};
