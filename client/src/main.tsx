import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Global error handlers to show runtime errors in the page (helps debug blank page)
window.addEventListener('error', (event: ErrorEvent) => {
  console.error('Global error:', event.error || event.message);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:1rem;color:#900;background:#fee;border-radius:6px;"><h3>Erreur JavaScript</h3><pre style="white-space:pre-wrap">$${
      (event.error && (event.error as any).stack) || event.message
    }</pre></div>`;
  }
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:1rem;color:#900;background:#fee;border-radius:6px;"><h3>Unhandled Rejection</h3><pre style="white-space:pre-wrap">$${
      (event.reason && ((event.reason as any).stack || event.reason)) || ''
    }</pre></div>`;
  }
});

try {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
} catch (err: any) {
  console.error('Render error:', err);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:1rem;color:#900;background:#fee;border-radius:6px;"><h3>Render Error</h3><pre style="white-space:pre-wrap">$${
      err && (err.stack || err.message) ? err.stack || err.message : err
    }</pre></div>`;
  }
}
