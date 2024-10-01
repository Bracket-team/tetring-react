import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import StartGame from './pages/StartGame';
import SettingPage from './pages/SettingPage';
import RankingPage from './pages/RankingPage';
import CollectionPage from './pages/CollectionPage';
import LoginPage from './login/Login';
import GoogleCallback from './login/GoogleCallback';
import Shop from './pages/Shop'; // 상점 경로

function App() {
  const [round, setRound] = useState(1); // 전역 라운드 상태
  const [gold, setGold] = useState(10);
  const [moneylevel, setMoneyLevel] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/startgame" element={
          <StartGame
            round={round}
            setRound={setRound}
            gold={gold}
            setGold={setGold}
            moneylevel={moneylevel }
            setMoneyLevel={setMoneyLevel }
          />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/shop" element={
          <Shop
            round={round}
            setRound={setRound}
            gold={gold}
            setGold={setGold}
            moneylevel={moneylevel }
            setMoneyLevel={setMoneyLevel }
          />} />
          
      </Routes>
    </Router>
  );
}

export default App;