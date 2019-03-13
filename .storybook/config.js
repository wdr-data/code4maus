import React from 'react';
import { configure, addDecorator } from '@storybook/react';

const req = require.context('../src/components', true, /\.stories\.jsx?$/);

const BackgroundDecorator = (story) => (
  <div style={{backgroundColor: 'darkorange', height: '100vh'}}>
    {story()}
  </div>
);

addDecorator(BackgroundDecorator);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
