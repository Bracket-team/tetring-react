import axios from 'axios';

export const purchaseRelic = async (slotNumber) => {
    console.log(slotNumber)
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error("로그인 정보가 없습니다.");
        }

        const response = await axios.patch(
            '/api/stores/relics',
            { slot_number: slotNumber },
            {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                },
            }
        );
        console.log("유물 구매 API쪽",JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("Failed to purchase relic:", error);
        throw error;
    }
};
