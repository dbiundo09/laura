import React, { useState } from 'react';
import '../styles/WelcomePage.css';

const WelcomePage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'poop') {
      onLogin(password);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome, My Love! 💕</h1>
        
        <div className="puns-container">
          <p>I like you for more than just your butt! ✨</p>
        </div>


        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter our special word..."
              className={showError ? 'shake' : ''}
            />
            {showError && <p className="error-message">Oopsie! That's not it! 🙈</p>}
          </div>
          <button type="submit">Enter with Love 💝</button>
        </form>
      </div>
    </div>
  );
};

export default WelcomePage; 