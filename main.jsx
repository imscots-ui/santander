import React from 'react';
import ReactDOM from 'react-dom/client';
import RafacApp from './rafac/RafacApp.jsx';
import App from './App.jsx';
import './index.css';

// ?app=santander loads the Santander banking prototype; default is RAFAC
const appParam = new URLSearchParams(window.location.search).get('app');
const ActiveApp = appParam === 'santander' ? App : RafacApp;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ActiveApp />
  </React.StrictMode>
);
