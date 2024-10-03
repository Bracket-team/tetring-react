import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Store = () => {
  const [storeData, setStoreData] = useState(null); // 상점 정보 상태
  const [error, setError] = useState(null); // 에러 상태

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!storeData) {
    return <div>상점 정보를 불러오는 중...</div>;
  }

  return (
    <div className="store">
      <h1>상점</h1>

      {/* 상점 정보 */}
      <div className="store-info">
        <p>리롤 가격: {storeData.store.reroll_price}$</p>
        <p>보유 금액: {storeData.store.money}$</p>
        <p>머니 레벨: {storeData.store.money_level}</p>
        <p>레벨업 비용: {storeData.store.money_level_up_price}$</p>
      </div>

      {/* 상점에 존재하는 블록 */}
      <h2>상점에서 판매 중인 블록</h2>
      <div className="store-blocks">
        {storeData.store_blocks.map((block) => (
          <div key={block.block_id} className="store-block">
            <p>블록 ID: {block.block_id}</p>
            <p>색깔: {block.color}</p>
            <p>모양: {formatBlockShape(block.shape)}</p> {/* 블록 모양 가공해서 출력 */}
            <p>슬롯 번호: {block.slot_number}</p>
          </div>
        ))}
      </div>

      {/* 상점에 존재하는 유물 */}
      <h2>상점에서 판매 중인 유물</h2>
      <div className="store-relics">
        {storeData.store_relics.map((relic) => (
          <div key={relic.relic_number} className="store-relic">
            <p>유물 이름: {relic.name}</p>
            <p>희귀도: {relic.rarity}</p>
            <p>효과: {relic.effect}</p>
            <p>가격: {relic.price}$</p>
            <p>슬롯 번호: {relic.slot_number}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 블록의 shape 문자열을 4x4 형태로 변환하는 함수
const formatBlockShape = (shape) => {
  const rows = [];
  for (let i = 0; i < shape.length; i += 4) {
    rows.push(shape.slice(i, i + 4).split('').map(Number).join(' ')); // 4자리씩 슬라이싱하여 출력
  }
  return rows.map(row => <div>{row}</div>); // 각 행을 렌더링
};

export default Store;
