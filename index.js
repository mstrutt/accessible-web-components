import AnimationLoop from './utils/animation-loop.js';
import FocusTrap from './utils/focus-trap.js';
import Modal from './utils/modal.js';

import rafPromise from './utils/raf-promise.js';
import transitionendPromise from './utils/transitionend-promise.js';

window['a11yWC'] = {
  AnimationLoop,
  FocusTrap,
  Modal,
  rafPromise,
  transitionendPromise,
};
