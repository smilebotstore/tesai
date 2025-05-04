import { useState } from 'react';

export default function PromoPage() {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCode = async () => {
    setError('');
    setPromoCode('');
    setCopied(false);

    try {
      const res = await fetch('/api/generate-promo');
      const data = await res.json();

      if (res.ok) {
        setPromoCode(data.code);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungi server.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{
      backgroundColor: 'black',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '2em', color: 'white', marginBottom: '30px' }}>Smile AI Promo Code</h1>

      <button onClick={generateCode} style={buttonStyle}>Generate Kode</button>
      <a href="https://wa.me/601160643471" style={{ ...buttonStyle, backgroundColor: '#25D366', marginTop: '10px' }}>
        Hubungi Kami
      </a>

      {promoCode && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5em', color: 'yellow' }}>{promoCode}</h2>
          <button onClick={copyToClipboard} style={{ ...buttonStyle, marginTop: '10px' }}>
            {copied ? 'Disalin!' : 'Salin Kode'}
          </button>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red', fontWeight: 'bold' }}>{error}</div>
      )}
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#ffffff',
  color: 'black',
  border: 'none',
  padding: '12px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '8px',
  fontWeight: 'bold',
};
