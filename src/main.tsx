import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for PWA (Universal iOS, Android, and Desktop Installability)
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Automatic update checking without blocking the app
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Inform user or auto-update on next refresh
                console.log('FARZA: تم تجهيز تحديث جديد للتطبيق في الخلفية');
              }
            };
          }
        };
      })
      .catch((err) => {
        // Graceful non-blocking fallback if browser policy restricts SW
        console.debug('Service Worker status:', err?.message || err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
