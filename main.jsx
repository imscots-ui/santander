/**
 * Santander Business Banking — Concept Prototype
 * Created by Alan Davidson · Alan.Davidson@santander.co.uk · May 2026
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import SquadronApp from './SquadronApp.jsx';
import CadetApp from './CadetApp.jsx';
import WingApp from './WingApp.jsx';
import './index.css';

const appParam = new URLSearchParams(window.location.search).get('app');

let ActiveApp = App;
if (appParam === 'squadron') ActiveApp = SquadronApp;
if (appParam === 'cadet')    ActiveApp = CadetApp;
if (appParam === 'wing')     ActiveApp = WingApp;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ActiveApp />
  </React.StrictMode>
);
