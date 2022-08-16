/* eslint-disable */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './auth0';

ReactDOM.render(
    <Auth0Provider
        domain={'0xdev.us.auth0.com'}
        client_id={'ZVpIx1a3Xz1BuRcz4cZGYvsoZY22TGVp'}
        redirect_uri={window.location.origin}
    >
    <App />
    </Auth0Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
