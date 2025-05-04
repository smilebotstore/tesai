import { useState } from 'react';

export default function PromoPage() {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  async function generateCode() {
    try {
      const res = await fetch('/api/generate-promo');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat kode');
      setCode(data.code);
      setCopied(false);
      setError('');
    } catch (err) {
      setError(err.message);
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 3000);
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Inline CSS style for animation */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        .fade-in-out {
          animation: fadeInOut 3s ease-in-out;
        }
      `}</style>

      <h1 className="bg-white text-black text-4xl md:text-5xl font-bold px-8 py-4 rounded-xl mb-10 shadow-lg">
        SMILE AI PROMO CODE
      </h1>

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={generateCode}
          className="bg-green-400 hover:bg-green-500 text-black px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all"
        >
          Generate Kode
        </button>

        <button
          onClick={() => window.open('https://wa.me/601160643471')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all"
        >
          Hubungi Kami
        </button>
      </div>

      {code && (
        <div className="mt-10 flex flex-col items-center">
          <div className="text-3xl font-mono bg-white text-black px-6 py-4 rounded-lg shadow-lg">
            {code}
          </div>
          <button
            onClick={copyToClipboard}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md shadow transition-all"
          >
            Copy
          </button>
          {copied && (
            <div className="mt-2 text-green-400 text-sm animate-pulse">Kode disalin!</div>
          )}
        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 fade-in-out">
          <div className="bg-white text-red-600 text-lg md:text-xl font-semibold px-6 py-4 rounded-xl shadow-lg">
            {error}
          </div>
        </div>
      )}
    </div>
  );
  }
