import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './components/Home.js';

const RenderApp = () => {
  render(
    <Home /> , document.getElementById('app')
  );
}

RenderApp();
