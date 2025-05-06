// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkUhHi05Kbt0jF6k1i6HykLnNoyW0-xTY",
  authDomain: "promocode-80aaa.firebaseapp.com",
  projectId: "promocode-80aaa",
  storageBucket: "promocode-80aaa.firebasestorage.app",
  messagingSenderId: "449257960728",
  appId: "1:449257960728:web:969d6e1f351e1526665a6d",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
