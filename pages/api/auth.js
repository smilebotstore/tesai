import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD40tcPnj2k5zs7BOBKuTxDJgk0_vJsG3o",
  authDomain: "loginpage-69d3f.firebaseapp.com",
  projectId: "loginpage-69d3f",
  storageBucket: "loginpage-69d3f.firebasestorage.app",
  messagingSenderId: "985775604123",
  appId: "1:985775604123:web:67e82da8ad6b4dfc9da13e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default async function handler(req, res) {
  const { email, password, action } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!email || !password || !action) {
    return res.status(400).json({ message: "Email, password, dan action wajib diisi." });
  }

  try {
    if (action === 'signup') {
      const signupUser = await createUserWithEmailAndPassword(auth, email, password);
      return res.status(200).json({ message: "Akun berhasil dibuat!", user: signupUser.user });
    } else if (action === 'login') {
      const loginUser = await signInWithEmailAndPassword(auth, email, password);
      return res.status(200).json({ message: "Berhasil login!", user: loginUser.user });
    } else {
      return res.status(400).json({ message: "Action tidak valid. Gunakan 'login' atau 'signup'." });
    }
  } catch (error) {
    // Tangani error spesifik dari Firebase
    let message = "Terjadi kesalahan. Silakan coba lagi.";
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Email ini sudah digunakan.';
        break;
      case 'auth/invalid-email':
        message = 'Format email tidak valid.';
        break;
      case 'auth/weak-password':
        message = 'Password terlalu lemah. Gunakan minimal 6 karakter.';
        break;
      case 'auth/user-not-found':
        message = 'Pengguna tidak ditemukan.';
        break;
      case 'auth/wrong-password':
        message = 'Password salah.';
        break;
      case 'auth/missing-password':
        message = 'Password wajib diisi.';
        break;
      case 'auth/too-many-requests':
        message = 'Terlalu banyak percobaan. Coba lagi nanti.';
        break;
      default:
        message = error.message;
    }
    return res.status(500).json({ message });
  }
}
