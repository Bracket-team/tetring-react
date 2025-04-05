import axios from 'axios';

export const purchaseBlock = async (slotNumber) => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error("로그인 정보가 없습니다.");
        }

        const response = await axios.patch(
            '/api/stores/blocks',
            { slot_number: slotNumber },
            {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Failed to purchase block:", error);
        throw error;
    }
};