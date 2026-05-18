/**
 * Santander Business Banking — Concept Prototype
 * Created by Alan Davidson · Alan.Davidson@santander.co.uk · May 2026
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import SquadronApp from './SquadronApp.jsx';
import './index.css';

const isSquadron = new URLSearchParams(window.location.search).get('app') === 'squadron';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isSquadron ? <SquadronApp /> : <App />}
  </React.StrictMode>
);
