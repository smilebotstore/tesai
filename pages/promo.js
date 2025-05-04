import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PromoPage() {
  const [promoCode, setPromoCode] = useState('');
  const [showCopy, setShowCopy] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setButtonClicked(true);
    setLoading(true);
    setPromoCode('');
    setShowCopy(false);
    setMessage('');

    const hasUsed = localStorage.getItem('promoUsed');

    if (hasUsed) {
      setTimeout(() => {
        setLoading(false);
        setMessage('Kamu sudah menggunakan promo code kamu');
      }, 1000);
      return;
    }

    try {
      const res = await fetch('/api/generate-promo');
      const data = await res.json();

      setLoading(false);

      if (data.code) {
        setPromoCode(data.code);
        setShowCopy(true);
        localStorage.setItem('promoUsed', 'true');
      } else {
        setMessage(data.error || 'Gagal membuat kode promo.');
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
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

  const handleBackToHome = () => {
    router.push('/');
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
      <style>{`
        .spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }

        .dot {
          width: 6px;
          height: 6px;
          margin: 0 2px;
          border-radius: 50%;
          background: white;
          animation: bounce 0.6s infinite alternate;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          to {
            opacity: 0.3;
            transform: translateY(-5px);
          }
        }
      `}</style>

      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '50px',
        lineHeight: '1.2'
      }}>
        Smile Store<br />Promo Code
      </h1>

      <button
        onClick={handleGenerate}
        style={{
          width: '260px',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: buttonClicked ? '#2a2a2a' : '#1f1f1f',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          marginBottom: '20px',
          cursor: 'pointer',
          transform: buttonClicked ? 'scale(0.97)' : 'scale(1)',
          transition: 'all 0.2s ease'
        }}
        onAnimationEnd={() => setButtonClicked(false)}
      >
        Generate Kode
      </button>

      {loading && (
        <div style={{
          marginBottom: '20px',
          padding: '14px 20px',
          border: '1px solid white',
          borderRadius: '16px',
          fontSize: '18px',
          textAlign: 'center',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div className="spinner">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          Loading Please Wait
        </div>
      )}

      {promoCode && !loading && (
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

      {message && !loading && (
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
        marginTop: (promoCode || loading || message) ? '20px' : '0'
      }}>
        Hubungi Kami
      </button>

      {/* Tombol Back To Home */}
      <button onClick={handleBackToHome} style={{
        width: '260px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '500',
        backgroundColor: '#0f0f0f',
        color: 'white',
        border: '2px solid white',
        borderRadius: '16px',
        cursor: 'pointer',
        marginTop: '16px'
      }}>
        Back To Home
      </button>
    </div>
  );
          }
