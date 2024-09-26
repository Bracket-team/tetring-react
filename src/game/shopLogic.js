import { useState } from 'react';

export const useShopLogic = ({ gold, setGold}) => {

  const [relic3, setRelic3] = useState(false);

  // Relic 3을 구매하는 로직
  const handleRelicBuy = () => {
    if (gold >= 10) {
      setGold(gold - 10);
      setRelic3(true);
    }
  };

  return {
    relic3,
    handleRelicBuy,
  };
};
