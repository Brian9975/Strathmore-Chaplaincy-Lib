import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthContextProvider from './context/AuthContext.tsx'
import StatesContextProvider from './context/StatesContext.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <ThemeProvider>
    <AuthContextProvider>
      <StatesContextProvider>
        <App />
      </StatesContextProvider>
    </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>,
)
