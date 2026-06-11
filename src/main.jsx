// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

// Interceptor global de fetch para inyectar credentials: "include" en peticiones locales de la API
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  const urlStr = typeof url === 'string' ? url : url?.url;
  if (urlStr && urlStr.includes('localhost:4000')) {
    options.credentials = 'include';
  }
  return originalFetch(url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)