import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { OrderContextProvider } from './context/OrderContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <OrderContextProvider>
      <App />
    </OrderContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

