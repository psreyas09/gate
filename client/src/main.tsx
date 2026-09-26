import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { installApiInterceptor } from './services/apiInterceptor'

// Install global API fallback interceptor
installApiInterceptor()

// Global window error listener for unhandled exceptions
window.addEventListener('error', (event) => {
  console.error('[GATE Global Uncaught Error]:', event.error || event.message, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Auto-reload on Vite dynamic chunk preload failure (e.g. after a new production deployment)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[Vite Preload Error]: Stale chunk detected after deployment. Reloading page...', event);
  window.location.reload();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[GATE Unhandled Promise Rejection]:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
