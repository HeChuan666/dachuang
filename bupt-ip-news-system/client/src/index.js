import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from './styles/GlobalStyles';
import axios from 'axios';

// 设置axios默认值
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);