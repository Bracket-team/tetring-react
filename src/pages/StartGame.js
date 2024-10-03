import React, { useEffect, useRef, useState } from 'react';
import Tetris from '../game/Tetris.js';
import '../css/global.css';
import '../css/StartGame.css'; // 기존 CSS 파일


const StartGame = ({ round, setRound, gold, setGold }) => {
  const [lineScore, setLineScore] = useState(0);  // 라인 점수
  const [comboScore, setComboScore] = useState(0);  // 콤보 점수

  // 점수 상태 업데이트 함수
  const handleScoreUpdate = (newLineScore, newComboScore) => {
    setLineScore(newLineScore);  // 실시간으로 라인 점수 업데이트
    setComboScore(newComboScore);  // 실시간으로 콤보 점수 업데이트
  };

  // 상태 관리
  return (
    <div className="game-container">
      <div className="gameinfo">
        <div id="round">Round {round}</div>
        <div id="targetScore-text">목표 점수</div>
        <div id="targetScore"></div>
        <div id="linecombo">
          라인점수 : {lineScore}<span id="lineScore"></span>  콤보점수 :{comboScore} <span id="comboScore"></span>
        </div>
        <div id="score-text">점수</div>
        <div id="score">
          <span id="finalScore"></span>
        </div>
        <div id="gold">보유 금액 : {gold}$</div>
        <div id="line"></div>
        <div className="relics">
          <div id="relic"><img src="/img/block1.png" className="relic" alt="relic1" /></div>
          <div id="relic"><img src="/img/block2.png" className="relic" alt="relic2" /></div>
          <div id="relic"></div>
          <div id="relic"></div>
          <div id="relic"></div>
        </div>
      </div>
      <Tetris updateScores={handleScoreUpdate} />
    </div>
  );
}

export default StartGame;
