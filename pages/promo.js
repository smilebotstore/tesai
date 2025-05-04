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

      if (data.code) {
        setPromoCode(data.code);
        setShowCopy(true);
        localStorage.setItem('promoUsed', 'true');
        setMessage('');
      } else {
        setPromoCode('');
        setShowCopy(false);
        setMessage(data.error || 'Gagal membuat kode promo.');
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
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '50px',
        lineHeight: '1.2'
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
        cursor: 'pointer'
      }}>
        Generate Kode
      </button>

      {promoCode && (
        <div style={{
          marginBottom: '20px',
          padding: '14px 20px',
          border: '1px solid white',
          borderRadius: '16px',
          fontSize: '20px',
          letterSpacing: '2px',
          textAlign: 'center',
          width: 'max-content',
          backgroundColor: 'transparent',
        }}>
          {promoCode}
          {showCopy && (
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleCopy} style={{
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
            </div>
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
          maxWidth: '300px'
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
        transition: 'margin-top 0.3s ease',
        marginTop: promoCode ? '20px' : '0'
      }}>
        Hubungi Kami
      </button>
    </div>
  );
}
