import React from 'react';
import ReactDOM from 'react-dom';
import './css/global.css'; // global.css 경로 지정
import './index.css'; // 선택 사항
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
