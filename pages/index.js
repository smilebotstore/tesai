import { useState } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [clicked, setClicked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      localStorage.setItem('isLoggedIn', 'true');
      Router.push('/home');
    } else {
      setError(data.error || 'Terjadi kesalahan.');
    }
  };

  return (
    <>
      <Head>
        <title>Login - Smile AI</title>
      </Head>
      <div style={styles.container}>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap');`}
        </style>
        <h1 style={styles.title}>Welcome To Smile AI!</h1>
        <p style={styles.subtitle}>
          {mode === 'signin' ? 'Sign In To Continue.' : 'Create Your Account To Get Started.'}
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
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, paddingRight: '40px' }}
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#999',
                fontSize: '20px',
              }}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
          </div>
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
              ? 'Belum Punya Akun? Sign Up Di Sini'
              : 'Sudah Punya Akun? Sign In Di Sini'}
          </p>
        </form>
      </div>
    </>
  );
}

const styles = {
  container: {
    fontFamily: "'Cal Sans', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '50px',
    backgroundColor: '#121212',
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
  },
  input: {
    marginBottom: '15px',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
    fontFamily: "'Cal Sans', sans-serif",
    width: '100%',
  },
  button: {
    padding: '15px',
    backgroundColor: '#000',
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
    color: '#000',
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
};
