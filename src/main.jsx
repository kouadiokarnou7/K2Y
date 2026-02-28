import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import LandingPage from './LandingPage.jsx'
import LoginPage   from './connexion.jsx'
import RegisterPage from './inscription'
import App         from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/auth/login"     element={<LoginPage />} />
        <Route path="/auth/register"  element={<RegisterPage />} />
        <Route path="/app"            element={<App />} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)