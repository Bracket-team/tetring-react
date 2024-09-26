import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css'; // 경로 수정

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home">
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
    </div>
  );
}

export default HomePage;