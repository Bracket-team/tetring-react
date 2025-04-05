import axios from 'axios';

export const fetchPlayerMoney = async () => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error("로그인 정보가 없습니다.");
        }

        const response = await axios.get('/api/stores/money', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.player_money;
    } catch (error) {
        console.error("Failed to fetch player money:", error);
        throw error;
    }
};
