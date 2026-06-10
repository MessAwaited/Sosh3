import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { seedInitialDataIfEmpty } from './store/registry'
import App from './App.tsx'

seedInitialDataIfEmpty()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
