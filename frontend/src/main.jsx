import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { inject } from '@vercel/analytics';  // ✅ Sahi import
import { injectSpeedInsights } from '@vercel/speed-insights';
// Vercel Analytics inject karo
inject();
injectSpeedInsights();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
