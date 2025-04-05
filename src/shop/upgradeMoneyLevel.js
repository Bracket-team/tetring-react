import axios from 'axios';

export const upgradeMoneyLevel = async () => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error("로그인 정보가 없습니다.");
        }

        const response = await axios.patch('/api/stores/level-up', {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // 인증 토큰 포함
                'Content-Type': 'application/json',
            },
        });
        console.log("머니레벨 증가API쪽",JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Failed to upgrade money level:", error);
        throw error;
    }
};
