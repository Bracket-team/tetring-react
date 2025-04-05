import axios from 'axios';

const START_ROUND_URL = '/api/games/round/start';

// 라운드 시작 API 함수
export const startRound = async () => {
    // 로컬 스토리지에서 액세스 토큰을 가져옴
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        return { success: false, error: '로그인 정보가 없습니다.' };
    }

    try {
        // GET 요청을 보내고, 헤더에 인증 토큰과 Content-Type을 설정
        const response = await axios.get(START_ROUND_URL, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 인증 토큰 포함
                'Content-Type': 'application/json',
            },
        });

        // 요청 성공 시 데이터 반환
        return { success: true, data: response.data };
    } catch (error) {
        // 에러가 발생한 경우 에러 메시지를 반환
        return {
            success: false,
            error: error.response?.data?.error || '라운드를 시작할 수 없습니다.',
            status: error.response?.status,
        };
    }
};
