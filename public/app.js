// Firebase config (ganti dengan punyamu)
const firebaseConfig = {
  apiKey: "AIzaSyD40tcPnj2k5zs7BOBKuTxDJgk0_vJsG3o",
  authDomain: "loginpage-69d3f.firebaseapp.com",
  projectId: "loginpage-69d3f",
  appId: "1:985775604123:web:67e82da8ad6b4dfc9da13e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Animasi form
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => container.classList.add("sign-up-mode"));
sign_in_btn.addEventListener("click", () => container.classList.remove("sign-up-mode"));

// Sign up
document.querySelector(".sign-up-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert("Sign up successful!");
    container.classList.remove("sign-up-mode");
  } catch (err) {
    alert(err.message);
  }
});

// Sign in
document.querySelector(".sign-in-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "/index.js"; // Redirect ke file utama AI-mu
  } catch (err) {
    alert(err.message);
  }
});
