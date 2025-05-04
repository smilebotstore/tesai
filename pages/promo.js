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
      backgroundColor: 'black',
      minHeight: '100vh',
      padding: '40px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '40px'
      }}>
        <span style={{ backgroundColor: 'white', color: 'black', padding: '10px 20px', borderRadius: '5px' }}>
          Smile AI Promo Code
        </span>
      </h1>

      <button onClick={handleGenerate} style={{
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px'
      }}>
        Generate Kode
      </button>

      {promoCode && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '24px', letterSpacing: '2px' }}>{promoCode}</p>
          {showCopy && (
            <button onClick={handleCopy} style={{
              marginTop: '10px',
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
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
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      <button onClick={handleContact} style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#25D366',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Hubungi Kami
      </button>
    </div>
  );
          }
