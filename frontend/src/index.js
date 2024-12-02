import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { store } from './redux/store';
import {Provider }from 'react-redux'
import { GoogleOAuthProvider } from "@react-oauth/google";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="947397347573-0nephq36dtkfm710h9qrkn258lsqomul.apps.googleusercontent.com">
    <Provider store={store}> 
      <App/>
       </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

