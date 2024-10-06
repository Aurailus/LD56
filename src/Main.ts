import { h, render } from 'preact';

import App from './components/App';

import './Style.pcss';

export const dvorak = true;

render(h(App, {}), document.body);

