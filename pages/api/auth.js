// pages/api/auth.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD40tcPnj2k5zs7BOBKuTxDJgk0_vJsG3o",
  authDomain: "loginpage-69d3f.firebaseapp.com",
  projectId: "loginpage-69d3f",
  storageBucket: "https://loginpage-69d3f.firebasestorage.app",
  messagingSenderId: "985775604123",
  appId: "1:985775604123:web:67e82da8ad6b4dfc9da13e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, action } = req.body;

  try {
    if (action === 'signup') {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return res.status(200).json({ message: 'Signup berhasil', user: userCredential.user });
    } else if (action === 'login') {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return res.status(200).json({ message: 'Login berhasil', user: userCredential.user });
    } else {
      return res.status(400).json({ error: 'Aksi tidak valid' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
