import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css'; // 경로 수정

function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false); // 모달 창 상태

  // 로컬 스토리지에서 access_token을 확인해 로그인 상태를 설정
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
    }
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // 로컬 스토리지에서 토큰 삭제
    setIsLoggedIn(false); // 로그인 상태 변경
    setShowModal(true); // 모달 창 표시

    // 2초 후에 모달 창을 닫고 홈 페이지로 리디렉트
    setTimeout(() => {
      setShowModal(false);
      navigate('/');
    }, 2000);
  };


  return (
    <div className="home">
      {/* 최상단 오른쪽에 로그인/로그아웃 버튼 */}
      <div className="header">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="button btnLogin">
            로그아웃
          </button>
        ) : (
          <button onClick={() => navigate('/login')} className="button btnLogin">
            로그인
          </button>
        )}
      </div>

      <div className="logo">
        <img src="/img/tetringlogo.png" alt="Tetring Logo" className="logo" />
      </div>

      <div className="main">
        <button onClick={() => navigate('/startgame')} className="button btnPush btnMain">
          게 임 시 작
        </button>
        <button onClick={() => navigate('/settings')} className="button btnPush btnMain">
          <img src="/img/settingicon.png" alt="설정 아이콘" />설 정<img src="/img/settingicon.png" alt="설정 아이콘" />
        </button>
        <button onClick={() => navigate('/ranking')} className="button btnPush btnMain">
          <img src="/img/rankingicon.png" alt="랭킹 아이콘" />랭 킹<img src="/img/rankingicon.png" alt="랭킹 아이콘" />
        </button>
        <button onClick={() => navigate('/collection')} className="button btnPush btnMain">
          <img src="/img/collectionicon.png" alt="도감 아이콘" />도 감<img src="/img/collectionicon.png" alt="도감 아이콘" />
        </button>
      </div>

      {/* 로그아웃 모달 창 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>로그아웃이 정상적으로 되었습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
