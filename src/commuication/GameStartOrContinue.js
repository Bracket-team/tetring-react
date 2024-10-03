import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameStart = () => {
  const [gameData, setGameData] = useState(null); // 게임 데이터 상태
  const [error, setError] = useState(null); // 에러 상태

  // 게임 시작/이어하기 데이터를 백엔드에서 불러오는 함수
  const fetchGameData = async () => {
    const accessToken = localStorage.getItem('access_token'); // 로컬 스토리지에서 토큰 가져오기
    if (!accessToken) {
      setError('로그인 정보가 없습니다.');
      return;
    }

    try {
      const response = await axios.get('/api/games/start', { 
        headers: {
          'Authorization': `Bearer ${accessToken}`, // 인증 토큰 포함
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Received data:', response.data); // 응답 데이터 확인
        setGameData(response.data); // 게임 데이터 상태 업데이트
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('진행 중인 게임을 찾을 수 없습니다.');
      } else {
        setError('게임 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!gameData) {
    return <div>게임 정보를 불러오는 중...</div>;
  }

  return (
    <div className="game-start">
      <h1>게임 시작</h1>

      {/* 받은 데이터 표시 */}
      <div>
        <h2>게임 정보</h2>
        <p><strong>Game ID:</strong> {gameData.data.game.game_id}</p>
        <p><strong>라운드:</strong> {gameData.data.game.round_number}</p>
        <p><strong>목표 점수:</strong> {gameData.data.game.round_goal}</p>
        <p><strong>상점 상태:</strong> {gameData.data.game.is_store ? '상점에 있음' : '게임 중'}</p>
      </div>
    </div>
  );
};

export default GameStart;
