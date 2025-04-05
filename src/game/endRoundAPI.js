import axios from 'axios';

const END_ROUND_URL = '/api/games/round/end';

// 게임 종료 요청 함수
export const endRound = async (totalScore) => {
    const accessToken = localStorage.getItem('access_token'); // 로컬 스토리지에서 토큰 가져오기
    if (!accessToken) {
        return { success: false, error: '로그인 정보가 없습니다.' };
    }

    console.log(totalScore)
    try {
        const response = await axios.patch(END_ROUND_URL, 
            { score: totalScore }, // Request body
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // 인증 토큰 포함
                    'Content-Type': 'application/json',
                },
            }
        );
        
        // 성공 시 서버 응답 데이터 반환
        console.log('Received data:', response.data); // 응답 데이터 확인
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        // 실패 시 에러 메시지 반환
        return {
            success: false,
            error: error.response?.data?.error || "라운드를 종료할 수 없습니다.",
            status: error.response?.status,
        };
    }
};
