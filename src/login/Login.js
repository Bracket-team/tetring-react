import React from 'react';

const Login = () => {
  const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST;
  const FRONTEND_HOST = process.env.REACT_APP_FRONTEND_HOST;
  const handleLogin = () => {
    // 백엔드의 Google OAuth2 엔드포인트로 리디렉트
    window.location.href = `${BACKEND_HOST}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(`${FRONTEND_HOST}/auth/google/callback`)}&mode=login`;
  };

  return (
    <div>
      <button onClick={handleLogin}>Google</button>
    </div>
  );
};

export default Login;
