import { useState } from 'react';

export default function PromoPage() {
  const [promoCode, setPromoCode] = useState('');
  const [showCopy, setShowCopy] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    const hasUsed = localStorage.getItem('promoUsed');

    if (hasUsed) {
      setMessage('Kamu sudah menggunakan promo code kamu');
      setPromoCode('');
      setShowCopy(false);
      return;
    }

    try {
      const res = await fetch('/api/generate-promo');
      const data = await res.json();

      if (data.success) {
        setPromoCode(data.code);
        setShowCopy(true);
        localStorage.setItem('promoUsed', 'true');
        setMessage('');
      } else {
        setPromoCode('');
        setShowCopy(false);
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat membuat promo code.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    alert('Kode berhasil disalin!');
  };

  const handleContact = () => {
    window.open('https://wa.me/601160643471', '_blank');
  };

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      minHeight: '100vh',
      padding: '40px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '60px',
        lineHeight: '1.2',
      }}>
        Smile Store<br />Promo Code
      </h1>

      <button onClick={handleGenerate} style={{
        width: '260px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '500',
        backgroundColor: '#1f1f1f',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        marginBottom: '20px',
        cursor: 'pointer',
      }}>
        Generate Kode
      </button>

      {promoCode && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '20px', letterSpacing: '2px' }}>{promoCode}</p>
          {showCopy && (
            <button onClick={handleCopy} style={{
              marginTop: '10px',
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#3a3a3a',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}>
              Copy
            </button>
          )}
        </div>
      )}

      {message && (
        <div style={{
          backgroundColor: '#f44336',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          maxWidth: '300px',
        }}>
          {message}
        </div>
      )}

      <button onClick={handleContact} style={{
        width: '260px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '500',
        backgroundColor: '#0f0f0f',
        color: 'white',
        border: '2px solid white',
        borderRadius: '16px',
        cursor: 'pointer',
      }}>
        Hubungi Kami
      </button>
    </div>
  );
}
