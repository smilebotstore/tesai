// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFcZWhRazPTXTD0QjJW0ZWFQBJy1CRBr0",
  authDomain: "smileai-cb4e7.firebaseapp.com",
  projectId: "smileai-cb4e7",
  storageBucket: "smileai-cb4e7.firebasestorage.app",
  messagingSenderId: "441097971726",
  appId: "1:441097971726:web:59494cd1c316828938f45f",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
