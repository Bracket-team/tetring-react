import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Tetris from '../game/Tetris.js';
import '../css/global.css';
import '../css/StartGame.css'; // 기존 CSS 파일
import { availableArtifacts } from '../game/relicLogic';


const StartGame = () => {
  const location = useLocation(); // navigate로 전달된 데이터를 받음
  const { gameData } = location.state || {}; // gameData가 있을 경우 받음
  console.log("게임 데이터를 가지고 달아나는 재혁이를 바라보는 신창섭의 마음으로 보는 디버깅", JSON.stringify(gameData, null, 2));

  const [lineScore, setLineScore] = useState(0);  // 라인 점수
  const [comboScore, setComboScore] = useState(0);  // 콤보 점수
  const [totalScore, setTotalScore] = useState(0);  // 최종 점수

  // 점수 상태 업데이트 함수
  const handleScoreUpdate = useCallback((newTotalScore, newLineScore, newComboScore) => {
    setTotalScore((prevTotal) => prevTotal + newTotalScore); // 이전 최종 점수에 새 점수 추가
    setLineScore((prevLineScore) => prevLineScore + newLineScore);  // 이전 라인 점수에 새 점수 추가
    setComboScore((prevComboScore) => prevComboScore + newComboScore);  // 이전 콤보 점수에 새 점수 추가
  }, []);
  
  // 유물 이름으로 이미지 주소를 찾는 함수
  const getArtifactImage = (relicName) => {
    const artifact = availableArtifacts.find(artifact => artifact.name === relicName);
    return artifact.address;
  };

  // 빈 relic_box 슬롯을 찾아서 유물들을 배치하는 함수
  const renderRelicsInBox = () => {
    const relicSlots = [1, 2, 3, 4, 5]; // relic1, relic2, ..., relic5
    const filledRelicImages = gameData.player_relics.map(relic => getArtifactImage(relic.name));
    
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

  // 상태 관리
  return (
    <div className="game-container">
      <div className="gameinfo">
        <div id="round">Round {gameData.game.round_number}</div>
        <div id="targetScore-text">목표 점수</div>
        <div id="targetScore">{gameData.game.round_goal}</div>
        <div id="linecombo">
          라인점수 : {lineScore}<span id="lineScore"></span>  콤보점수 :{comboScore} <span id="comboScore"></span>
        </div>
        <div id="score-text">점수</div>
        <div id="score">
          <span id="finalScore">{totalScore}</span>
        </div>
        <div id="gold">보유 금액 : {gameData?.store?.money ?? gameData?.money}$</div>
        <div id="line"></div>
        <div className="relics">{ renderRelicsInBox() }</div>
      </div>
      <Tetris gameData={gameData} updateScores={handleScoreUpdate} nowtotalscore={totalScore} />
    </div>
  );
}

export default StartGame;
