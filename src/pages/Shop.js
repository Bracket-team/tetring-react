import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate import
import '../css/shop.css'; // CSS 파일
import { useShopLogic } from '../game/shopLogic'; // 로직 파일 import

const Shop = ({round, setRound, gold, setGold, moneylevel, setMoneyLevel}) => {
  const { relic3, handleRelicBuy } = useShopLogic({ gold, setGold }); // 상점 로직 사용
  const navigate = useNavigate(); // navigate 함수 사용
  
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부 관리

  const handleModal = () => {
    setShowModal(true); // 모달을 보여줌
      setTimeout(() => {
        setShowModal(false); // 1초 후에 모달을 숨김
      }, 1000);
  }
  const handleStartClick = () => {
    setRound(round + 1);
    navigate('/startgame');
  };

  // 머니 레벨 증가
  const handleMoneylevelClick = () => {
    if (gold >= 10) {
      setGold(gold - 10);
      setMoneyLevel(moneylevel + 1);
    } else {
      handleModal();
    }
  };

  // 유물 리롤
  const handleRerollClick = () => {
    // 리롤 기능 추가 예정
  };

  return (
    <div className="shop">
      <div className="gameinfo">
        <div id="round">Round {round}</div>
        <div id="targetScore-text">목표 점수</div>
        <div id="targetScore">2400</div>
        <div id="gold">보유 금액 : {gold}$</div>
      </div>

      {/* 모달창 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span>돈이 부족합니다</span>
          </div>
        </div>
      )}

      <div className="background">
        <div className="relic_box">
          <div id="relic1"><img src="../img/block1.png" className="relic" alt="relic 1" /></div>
          <div id="relic2"><img src="../img/block2.png" className="relic" alt="relic 2" /></div>
          <div id="relic3">
            {relic3 && <img src="../img/T-relic.png" className="relic" alt="relic 3" />}
          </div>
          <div id="relic4"></div>
          <div id="relic5"></div>
        </div>
        <div className="upgrade_reroll_box">
          <div className="upgrade_box">
            <div id="upgrade_box_text">머니 레벨 {moneylevel}</div>
            <div id="upgrade_box_button" onClick={handleMoneylevelClick} >업그레이드</div>
          </div>
          <div className="reroll_box">
            <div id="reroll_box_button" onClick={handleRerollClick}>리롤 2$</div>
            <div id="relic_buy_box1" onClick={handleRelicBuy}>
              <img src="../img/T-relic.png" className="relic" alt="T relic" />10$
            </div>
            <div id="relic_buy_box2">
              <img src="../img/combo-relic.png" className="relic" alt="Combo relic" />10$
            </div>
          </div>
        </div>
        <div className="blockshop_button_box">
          <div className="blockshop_box">
            <div id="block_buy_box">
              <img src="../img/yellowblock.png" className="block_yellow" alt="Yellow block" />5$
            </div>
            <div id="block_buy_box">
              <img src="../img/orangeblock.png" className="block_other" alt="Orange block" />5$
            </div>
            <div id="block_buy_box">
              <img src="../img/pupleblock.png" className="block_other" alt="Purple block" />5$
            </div>
          </div>
          <div className="button_box">
            <div className="block_button">Block</div>
            <div className="start_button" onClick={handleStartClick}>Start</div> {/* 클릭 시 handleStartClick 호출 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
