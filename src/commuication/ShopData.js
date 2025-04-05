import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Store = () => {
  const [storeData, setStoreData] = useState(null); // 상점 정보 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  const location = useLocation();
  const result = location.state?.result;
  const gameData = location.state?.gameData;

  console.log("받은 result 데이터 디버깅:", JSON.stringify(result,null,2));
  
  // 상점 데이터를 백엔드에서 불러오는 함수
  const fetchStoreData = async () => {
    const accessToken = localStorage.getItem('access_token'); // 로컬 스토리지에서 토큰 가져오기
    if (!accessToken) {
      setError('로그인 정보가 없습니다.');
      return;
    }

    try {
      const response = await axios.get('/api/stores', {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // 인증 토큰 포함
          'Content-Type': 'application/json',
        },
      });

      setStoreData(response.data); // 상점 데이터 상태 업데이트
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('라운드가 진행 중입니다.');
        } else if (error.response.status === 404) {
          setError('진행 중인 게임을 찾을 수 없습니다.');
        } else {
          setError('상점 정보를 가져오는 데 실패했습니다.');
        }
      } else {
        setError('상점 정보를 가져오는 중 에러가 발생했습니다.');
      }
    }
  };

  // 컴포넌트가 마운트될 때 상점 데이터를 불러옴
  useEffect(() => {
    fetchStoreData();
  }, []);


  useEffect(() => {
    if (storeData) {
      // 데이터를 가지고 StartGame으로 이동
      navigate('/shop', { state: { storeData: storeData , result: result, gameData: gameData} });
    }
  }, [storeData, navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!storeData) {
    return <div>상점 정보를 불러오는 중...</div>;
  }

  return (
    <div className="store">
      <h1>상점</h1>
    </div>
  );
};

export default Store;
