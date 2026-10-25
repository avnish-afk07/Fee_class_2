import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

import './styles/global.css';
import './styles/components.css';
import './styles/cart.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* NEW (PE-2): Provider makes the Redux store available to every component */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
