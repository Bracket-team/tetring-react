import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom'; // React Router의 useNavigate import
import '../css/shop.css'; // CSS 파일
import { availableArtifacts } from '../game/relicLogic';
import { upgradeMoneyLevel } from '../shop/upgradeMoneyLevel';
import { purchaseRelic } from '../shop/buyRelic';
import { purchaseBlock } from '../shop/buyBlock';
import { fetchPlayerMoney } from '../shop/fetchPlayerMoney';
import { startRound } from '../game/startRoundAPI';

const Shop = () => {
  const navigate = useNavigate(); // navigate 함수 사용
  
  // 상점 데이터
  const location = useLocation(); // navigate로 전달된 데이터를 받음
  const storeData = location.state?.storeData;
  const result = location.state?.result;
  const gameData = location.state?.gameData;

  // console.log("상점 데이터",JSON.stringify(storeData, null, 2));
  // console.log("게임 결과",JSON.stringify(result, null, 2));
  
  const [playerrelics, setPlayerRelics] = useState(gameData.player_relics || []); // 초기 유물 상태
  const [relics, setRelics] = useState(storeData.data.store_relics || []);
  const [moneyLevel, setMoneyLevel] = useState(storeData.data.store.money_level || 0);
  const [money, setMoney] = useState(storeData.data.store.money || 0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // console.log(JSON.stringify(relics, null, 2)) // 디버깅용

  // 모달창
  const handleModal = () => {
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 1000);
  };

  // 특정 슬롯에 해당하는 유물 가져오기
  const getRelicBySlot = (slotNumber) => {
    return relics.find(r => r.slot_number === slotNumber);
  };

  // 유물 이름으로 이미지 주소를 찾는 함수
  const getArtifactImage = (relicName) => {
    const artifact = availableArtifacts.find(artifact => artifact.name === relicName);
    return artifact.address;
  };

  // 머니레벨 증가
  const handleMoneylevelClick = async () => {
    try {
      const result = await upgradeMoneyLevel();

      if (result.data.can_buy) {
        setMoneyLevel(prevLevel => prevLevel + 1);
        setMoney(result.data.remained_money);
      } else {
        handleModal();
      }
    } catch (error) {
      setError("업그레이드 요청에 실패했습니다.");
      console.error(error);
    }
  };

  //유물 구매
  const handleRelicBuy = async (slotNumber) => {
    // console.log(slotNumber)
    try {
      const result = await purchaseRelic(slotNumber);
      console.log("유물 구매 샵쪽", JSON.stringify(result, null, 2));
      if (result.data.can_buy) {
        const newRelic = result.data.relic;
        setPlayerRelics((prevRelics) => [...prevRelics, newRelic]);
        setMoney(result.data.remained_money);
      } else {
        handleModal();
      }
    } catch (error) {
      setError("유물 구매 요청에 실패했습니다.");
      console.error(error);
    }
  };

  //블럭 구매
  const handleBlockBuy = async (slotNumber) => {
    try {
      const result = await purchaseBlock(slotNumber);

      if (result.data.can_buy) {
        setMoney(result.data.remained_moeny);
        alert(`구매한 블록: ID ${result.data.block.block_id}, 색상: ${result.data.block.block_color}`);
      } else {
        handleModal();
      }
    } catch (error) {
      setError("블록 구매 요청에 실패했습니다.");
      console.error(error);
    }
  };

  
  // 빈 relic_box 슬롯을 찾아서 유물들을 배치하는 함수
  const renderRelicsInBox = () => {
    const relicSlots = [1, 2, 3, 4, 5]; // relic1, relic2, ..., relic5
    const filledRelicImages = playerrelics.map(relic => getArtifactImage(relic.name));
    
    // relicSlots와 filledRelicImages를 사용해 유물을 빈 슬롯부터 채움
    return relicSlots.map((slot, index) => (
      <div key={slot} id={`relic${slot}`}>
        {filledRelicImages[index] ? (
          <img src={filledRelicImages[index]} alt={`유물 ${index + 1}`} className="relic" />
        ) : (
          <p></p>
        )}
      </div>
    ));
  };
  
// Start 버튼 클릭 시의 로직 추가
  const handleStartClick = async () => {
    const roundResult = await startRound();
    console.log("스타트", JSON.stringify(roundResult, null, 2));
    if (roundResult.success) {
      navigate('/startgame', { state: { gameData: roundResult.data.data } });
    } else {
      setError('라운드 시작에 실패했습니다.');
      console.error('Error:', roundResult.error);
    }
  }


  return (
    <div className="shop">
      <div className="gameinfo">
        <div id="round">Round { result.next_round_number}</div>
        <div id="targetScore-text">목표 점수</div>
        <div id="targetScore">{ result.next_round_goal}</div>
        <div id="gold">보유 금액 : { money}$</div>
      </div>

      <div className="background">
      <div className="relic_box">{renderRelicsInBox()}</div>
        <div className="upgrade_reroll_box">
          <div className="upgrade_box">
            <div id="upgrade_box_text">머니 레벨 {moneyLevel}</div>
            <div id="upgrade_box_button" onClick={handleMoneylevelClick} >업그레이드</div>
          </div>
          <div className="reroll_box">
            <div id="reroll_box_button" >리롤 {storeData.data.store.reroll_price}$</div>
            {/* Slot 1 유물 */}
            <div id="relic_buy_box1" onClick={() => handleRelicBuy(1)}>
            {(() => {
                const relic = getRelicBySlot(1);
                return relic ? (
                  <>
                    <img src={getArtifactImage(relic.name)} alt={relic.name} className="relic" />
                    <p>{relic.price}$</p>
                  </>
                ) : (
                  <p>슬롯 1 비어 있음</p>
                );
              })()}
            </div>
            {/* Slot 2 유물 */}
            <div id="relic_buy_box2" onClick={() => handleRelicBuy(2)}>
            {(() => {
                const relic = getRelicBySlot(2);
                return relic ? (
                  <>
                    <img src={getArtifactImage(relic.name)} alt={relic.name} className="relic" />
                    <p>{relic.price}$</p>
                  </>
                ) : (
                  <p>슬롯 2 비어 있음</p>
                );
              })()}
            </div>
          </div>
        </div>
        <div className="blockshop_button_box">
          <div className="blockshop_box">
            <div id="block_buy_box1" onClick={() => handleBlockBuy(1)}></div>
            <div id="block_buy_box2" onClick={() => handleBlockBuy(2)}></div>
            <div id="block_buy_box3" onClick={() => handleBlockBuy(3)}></div>
          </div>
          <div className="button_box">
            <div className="block_button">Block</div>
            <div className="start_button" onClick={handleStartClick}>Start</div> 
          </div>
        </div>
      </div>

      {/* 모달창 관리 */}
    {showModal && (
      <div className="modal">
        <div className="modal-content">
          <span>돈이 부족합니다</span>
        </div>
      </div>
    )}
    </div>
  );
};

export default Shop;
