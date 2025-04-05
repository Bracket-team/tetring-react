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

//test용 라우팅 나중에 지워야함 
import ShopData from './commuication/ShopData';
import GameStartOrContinue from './commuication/GameStartOrContinue';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/startgame" element={<StartGame/>} />
        <Route path="/gamestartorcontinue" element={<GameStartOrContinue/>}/>
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/shopdata" element={<ShopData />} /> 
      </Routes>
    </Router>
  );
}

export default App;

