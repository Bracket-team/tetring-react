import React from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const ResultModal = ({ isOpen, onRequestClose, resultData, highscore }) => {
    const navigate = useNavigate(); // navigate 함수 선언

    const handleClose = () => {
        onRequestClose(); // 기존 닫기 기능
        navigate('/'); // 메인 화면으로 이동
    };

    console.log("모달 부분 디버깅",JSON.stringify(resultData, null, 2));
    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose} 
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                },
            }}
        >
            <h2>게임 결과</h2>
            {resultData ? (
                <div>
                    <p>최대 라운드 수: {resultData.data.round_number}</p>
                    <p>최고 점수: {resultData.data.best_score}</p>
                    <p>보유 블록 수: {resultData.data.block_count}</p>
                    <p>보유 금액: {resultData.data.money}</p>

                    <h3>유물 목록</h3>
                    {resultData.relics && resultData.relics.length > 0 ? (
                        resultData.relics.map((relic, index) => (
                            <div key={index}>
                                <p>유물 이름: {relic.name}</p>
                                <p>희귀도: {relic.rarity}</p>
                                <p>효과: {relic.effect}</p>
                                {relic.rate && <p>계수: {relic.rate}</p>}
                                <p>슬롯 번호: {relic.slot_number}</p>
                            </div>
                        ))
                    ) : (
                        <p>유물이 없습니다.</p>
                    )}
                </div>
            ) : (
                <p>데이터를 불러오는 중입니다...</p>
            )}
            <button onClick={handleClose}>닫기</button>
        </Modal>
    );
};

export default ResultModal;
