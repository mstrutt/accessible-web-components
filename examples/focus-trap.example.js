import FocusTrap from './utils/focus-trap.js';

const fieldset = document.querySelector('fieldset');
const focusTrap = new FocusTrap(fieldset);

document.querySelector('.start').addEventListener('click', start);
document.querySelector('.stop').addEventListener('click', stop);

function start() {
  focusTrap.start();
  fieldset.focus();
}

function stop() {
  focusTrap.stop();
}
