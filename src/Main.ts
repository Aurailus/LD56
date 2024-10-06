import { h, render } from 'preact';

import App from './components/App';

import './Style.pcss';

const inQP = (val: string) => (location.href.includes(`?${val}`) || location.href.includes(`&${val}`));

export const IS_DVORAK = inQP("dvorak");
export const IS_DEBUG = inQP("debug");
export const NO_MOTION = inQP("nomotion");
export const NO_TILT = inQP("notilt") || NO_MOTION;

render(h(App, {}), document.body);

