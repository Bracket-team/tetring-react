import axios from 'axios';

const GET_GAME_RESULT_URL = '/api/games/result';

export const getGameResult = async () => {
    // 로컬 스토리지에서 액세스 토큰을 가져옴
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return { success: false, error: '로그인 정보가 없습니다.' };
    }

    try {
        // GET 요청을 보내고, 헤더에 인증 토큰과 Content-Type을 설정
        const response = await axios.get(GET_GAME_RESULT_URL, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 인증 토큰 포함
                'Content-Type': 'application/json',
            },
        });

        // 요청 성공 시 데이터를 반환
        console.log('Received data:', response.data); // 응답 데이터 확인
        return { success: true, data: response.data };
    } catch (error) {
        // 에러가 발생한 경우 에러 메시지를 반환
        return { success: false, error: error.response?.data?.error || '게임 최종 결과를 불러올 수 없습니다.' };
    }
};
