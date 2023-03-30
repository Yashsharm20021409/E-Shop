import React from 'react';
import {createRoot} from "react-dom/client"
import App from './App';
import { Provider } from 'react-redux';
import Store from './redux/store';

const rootEle = document.getElementById('root');
const root = createRoot(rootEle)
root.render(
  <Provider store={Store}>
    <App/>
  </Provider>
);
