import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { InspectorProvider } from './components/dev/InspectorContext';
import './index.css';

// Gracefully handle browser extension messaging disconnects in iframe environments
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.includes('Could not establish connection') ||
      msg.includes('Receiving end does not exist') ||
      msg.includes("reading 'allowed'") ||
      msg.includes('allowed')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = typeof reason === 'string' ? reason : (reason?.message || '');
    if (
      msg.includes('Could not establish connection') ||
      msg.includes('Receiving end does not exist') ||
      msg.includes("reading 'allowed'") ||
      msg.includes('allowed')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <InspectorProvider>
        <App />
      </InspectorProvider>
    </AuthProvider>
  </StrictMode>,
);
