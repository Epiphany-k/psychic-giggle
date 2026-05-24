import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 注册 Service Worker (PWA)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
