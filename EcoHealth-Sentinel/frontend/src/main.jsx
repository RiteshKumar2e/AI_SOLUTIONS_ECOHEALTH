import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId="1069754292181-7gpja9s9hvv74rtovtjr9kmk83qeqg2u.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  );
} else {
  console.error('Root element not found!');
}
