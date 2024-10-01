import React, { useState, useEffect } from 'react';

function PlayerBlocks() {
const [playerBag, setPlayerBag] = useState({});
const [error, setError] = useState(null);

// 백엔드에서 블록 데이터를 받아와 가공하는 함수
useEffect(() => {
    fetch('http://localhost:8080/api/games/blocks', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,  // 필요한 인증 키
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('네트워크 응답이 실패했습니다');
        }
        return response.json();
    })
    .then((data) => {
        // player_bag 형식으로 데이터 가공
        const bag = {};
        data.player_blocks.forEach((block) => {
            bag[block.block_id] = {
                color: block.color,
                shape: sliceShape(block.shape), // shape 데이터를 가공하여 배열 형태로 저장
            };
        });
        setPlayerBag(bag); // 가공된 데이터를 상태에 저장
    })
    .catch((error) => setError(error.message));
}, []);

// shape 데이터를 4x4 배열로 변환하는 함수
const sliceShape = (shape) => {
    const result = [];
    for (let i = 0; i < shape.length; i += 4) {
        result.push(shape.slice(i, i + 4).split('').map(Number)); // 4개씩 슬라이싱 후 배열로 변환
    }
    return result;
};

if (error) {
    return <div>Error: {error}</div>;
}

return (
    <div>
        <h1>플레이어의 블록 목록</h1>
        {Object.keys(playerBag).length === 0 ? (
            <p>블록 데이터를 불러오는 중...</p>
        ) : (
            <ul>
            {Object.keys(playerBag).map((blockId) => (
                <li key={blockId}>
                <strong>ID:</strong> {blockId} | 
                <strong> Color:</strong> {playerBag[blockId].color} | 
                <strong> Shape:</strong>
                <pre>{JSON.stringify(playerBag[blockId].shape, null, 2)}</pre> {/* shape를 보기 좋게 표시 */}
                </li>
            ))}
            </ul>
        )}
    </div>
    );
}

export default PlayerBlocks;
