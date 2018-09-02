import rafPromise from './raf-promise.js';
import transitionendPromise from './transitionend-promise.js';

const DEFAULT_OPTIONS = {
  hasBackdrop: true,
  shiftFocus: true,
  visibleClass: 'is-visible',
};

export default class Modal {
  constructor(element, options={}) {
    this.element = element;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.isOpen = false;
    this.triggerElement = null;

    this.element.setAttribute('aria-hidden', 'true');
    this.element.setAttribute('tabindex', '-1');
  }

  open(event) {
    this.isOpen = true;
    this.element.setAttribute('aria-hidden', 'false');
    this.element.offsetHeight;
    this.element.classList.add(this.options.visibleClass);
    if (this.options.shiftFocus) {
      this.element.focus();
      if (event) {
        this.triggerElement = event.currentTarget;
      }
    }
  }

  close(event) {
    this.isOpen = false;
    this.element.classList.remove(this.options.visibleClass);
    transitionendPromise(this.element, 'opacity')
      .then(() => {
        if (this.isOpen) {
          return;
        }
        this.element.setAttribute('aria-hidden', 'true');
        if (this.shiftFocus && this.triggerElement) {
          this.triggerElement.focus();
          this.triggerElement = null;
        }
      }); 
  }
};
