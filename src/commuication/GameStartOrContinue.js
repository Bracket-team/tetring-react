import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { startRound } from '../game/startRoundAPI';

const GameStart = () => {
  const [gameData, setGameData] = useState(null); // 게임 데이터 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

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


  // 게임 데이터를 확인하고 라운드 시작 API 호출
  useEffect(() => {
    const initiateRoundIfInStore = async () => {
      if (gameData) {
        const { is_store } = gameData.data.game;

        // 플레이어가 상점에 있을 경우 라운드 시작 API 호출
        if (is_store) {
          const roundResponse = await startRound();

          if (roundResponse.success) {
            // 라운드 시작 데이터와 함께 StartGame으로 이동
            navigate('/startgame', { state: { gameData: { ...gameData.data, store: roundResponse.data } } });
          } else {
            setError('라운드를 시작할 수 없습니다.');
          }
        } else {
          // 게임 중이면 바로 StartGame으로 이동
          navigate('/startgame', { state: { gameData: gameData.data } });
        }
      }
    };

    initiateRoundIfInStore();
  }, [gameData, navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!gameData) {
    return <div>게임 정보를 불러오는 중...</div>;
  }

  return (
    <div className="game-start">
      <h1>게임이 시작중입니다.</h1>

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
