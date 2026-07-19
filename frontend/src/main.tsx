import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global Fetch Interceptor for Production API routing
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api')) {
    const apiBase = import.meta.env.VITE_API_URL || '';
    input = `${apiBase}${input}`;
  } else if (input instanceof URL && input.pathname.startsWith('/api')) {
    const apiBase = import.meta.env.VITE_API_URL || '';
    input = new URL(`${apiBase}${input.pathname}${input.search}`);
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
