import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthContextProvider from './context/AuthContext.tsx'
import StatesContextProvider from './context/StatesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <StatesContextProvider>
        <App />
      </StatesContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
