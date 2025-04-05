import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('로그인 처리 중...');

  useEffect(() => {
    // 쿼리 매개변수 파싱
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // 액세스 토큰을 로컬 스토리지에 저장
        localStorage.setItem('access_token', accessToken);

      // 로그인 성공 메시지 설정
      setMessage('로그인이 성공했습니다! 잠시 후 홈 화면으로 이동합니다.');

      // 2초 후에 HomePage로 리디렉션
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      // 액세스 토큰이 없으면 에러 처리
      setMessage('액세스 토큰을 찾을 수 없습니다.');
    }
  }, [location, navigate]);

    return <div>{message}</div>;
};

export default GoogleCallback;
