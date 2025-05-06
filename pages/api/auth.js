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

  if (req.method === 'POST') {
    try {
      switch (action) {
        case 'signup':
          // Handle user sign up
          const signupUser = await createUserWithEmailAndPassword(auth, email, password);
          res.status(200).json({ message: "User created successfully", user: signupUser.user });
          break;
        case 'login':
          // Handle user login
          const loginUser = await signInWithEmailAndPassword(auth, email, password);
          res.status(200).json({ message: "User logged in successfully", user: loginUser.user });
          break;
        default:
          res.status(400).json({ error: "Invalid action" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
