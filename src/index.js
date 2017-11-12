import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import http from './http';
import bggApi from './BggApiHelper.js';

window.BGG = {
  http: http,
  api: bggApi
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
