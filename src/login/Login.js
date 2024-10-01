import React from 'react';

const Login = () => {
  const handleLogin = () => {
    // 백엔드의 Google OAuth2 엔드포인트로 리디렉트
    window.location.href = `http://localhost:8080/oauth2/authorization/google?redirect_uri=${encodeURIComponent('http://localhost:3000/auth/google/callback')}&mode=login`;
  };

  return (
    <div>
      <button onClick={handleLogin}>Google로 로그인</button>
    </div>
  );
};

export default Login;
