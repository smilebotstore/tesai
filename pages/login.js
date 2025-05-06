import { useEffect } from 'react'; import Head from 'next/head';

export default function LoginPage() { useEffect(() => { const signUpBtn = document.getElementById('signUp'); const signInBtn = document.getElementById('signIn'); const container = document.getElementById('container');

if (signUpBtn && signInBtn && container) {
  signUpBtn.addEventListener('click', () => {
    container.classList.add('sign-up-mode');
  });

  signInBtn.addEventListener('click', () => {
    container.classList.remove('sign-up-mode');
  });
}

}, []);

return ( <> <Head> <title>Login & Sign Up</title> <link
href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap"
rel="stylesheet"
/> <style>{* {margin: 0;padding: 0;box-sizing: border-box;} body, input {font-family: 'Poppins', sans-serif;} .container {position: relative;width: 100%;background: #fff;min-height: 100vh;overflow: hidden;} .form-container {position: absolute;width: 100%;height: 100%;top: 0;left: 0;display: flex;justify-content: center;align-items: center;} .form-container form {display: flex;flex-direction: column;gap: 1rem;} input {padding: 0.8rem;width: 250px;} button {padding: 0.8rem;background: #5995fd;color: white;border: none;cursor: pointer;} .overlay-container {position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;} .overlay {background: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);color: white;display: flex;width: 100%;height: 100%;align-items: center;justify-content: space-between;} .overlay-panel {padding: 2rem;} .ghost {background: transparent;border: 1px solid white;color: white;padding: 0.6rem 1.2rem;cursor: pointer;} .sign-up-mode .sign-in-container {display: none;} .sign-up-mode .sign-up-container {display: block;} .sign-in-container {display: block;} .sign-up-container {display: none;}}</style> </Head> <div className="container" id="container"> <div className="form-container sign-up-container"> <form id="signup-form"> <h1>Create Account</h1> <input type="email" placeholder="Email" id="signup-email" required /> <input type="password" placeholder="Password" id="signup-password" required /> <button type="submit">Sign Up</button> </form> </div>

<div className="form-container sign-in-container">
      <form id="login-form">
        <h1>Sign in</h1>
        <input type="email" placeholder="Email" id="login-email" required />
        <input type="password" placeholder="Password" id="login-password" required />
        <button type="submit">Sign In</button>
      </form>
    </div>

    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1>Welcome Back!</h1>
          <p>To keep connected, please log in with your credentials</p>
          <button className="ghost" id="signIn">Sign In</button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1>Hello, Friend!</h1>
          <p>Enter your details and start your journey with us</p>
          <button className="ghost" id="signUp">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</>

); }

