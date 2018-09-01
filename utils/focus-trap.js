import keyCodes from './key-codes.js';

export const FOCUSABLE_ELEMENTS = [
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'object:not([disabled])',
  'a[href]',
  'area[href]',
  'iframe',
  'audio',
  'video',
  '[contentEditable=""]',
  '[contentEditable="true"]',
  '[tabindex]',
]
  .map(selector => `${selector}:not([tabindex="-1"])`)
  .join(',');

export default class FocusTrap {
  constructor(element) {
    this.element = element;
    this.focusableChildren = [];
    this.firstFocusableChild = null;
    this.lastFocusableChild = null;
    this.boundOnKeydown = this.onKeydown.bind(this);

    this.findChildren();
  }

  findChildren() {
    this.focusableChildren = [
      ...this.element.querySelectorAll(FOCUSABLE_ELEMENTS)
    ];
    this.firstFocusableChild = this.focusableChildren[0];
    this.lastFocusableChild = this.focusableChildren[this.focusableChildren.length - 1];
  }

  onKeydown(event) {
    // Only care about presses to the tab key
    if (event.keyCode !== keyCodes.TAB) {
      return;
    }

    const isFirstChild = event.target === this.firstFocusableChild;
    const isLastChild = event.target === this.lastFocusableChild;

    // Tabbing somewhere in the middle of the content
    if (this.element.contains(event.target) && !isFirstChild && !isLastChild) {
      return;
    }

    // Tabbing back from the first child
    if (event.shiftKey && isFirstChild) {
      event.preventDefault();
      this.lastFocusableChild.focus();
      return;
    }

    // Tabbing forward from the last child OR tabbing from outside the parent element
    if (!this.element.contains(event.target) || (!event.shiftKey && isLastChild)) {
      event.preventDefault();
      this.firstFocusableChild.focus();
      return;
    }
  }

  start() {
    window.addEventListener('keydown', this.boundOnKeydown);
  }

  stop() {
    window.removeEventListener('keydown', this.boundOnKeydown);
  }

  destroy() {
    this.stop();
    this.focusableChildren = [];
    this.firstFocusableChild = null;
    this.lastFocusableChild = null;
    this.boundOnKeydown = null;
  }
};
