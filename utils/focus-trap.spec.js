import FocusTrap from './focus-trap.js';
import keyCodes from './key-codes.js';

describe('FocusTrap', () => {
  let focusTrap;
  let element;
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    element = document.createElement('div');
    focusTrap = new FocusTrap(element);
    addEventListenerSpy = sinon.spy(window, 'addEventListener');
    removeEventListenerSpy = sinon.spy(window, 'removeEventListener');
  });

  afterEach(() => {
    focusTrap.destroy();
    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
  });

  describe('start()', () => {
    it('binds an event listener', () => {
      focusTrap.start();

      expect(addEventListenerSpy.calledOnce).to.be.true;
      expect(removeEventListenerSpy.notCalled).to.be.true;
    });
  });

  describe('stop()', () => {
    it('removes the event listener', () => {
      focusTrap.stop();

      expect(addEventListenerSpy.notCalled).to.be.true;
      expect(removeEventListenerSpy.calledOnce).to.be.true;
    });
  });

  describe('destroy()', () => {
    it('calls stop()', () => {
      const stopSpy = sinon.spy(focusTrap, 'stop');
      focusTrap.destroy();
      expect(stopSpy.calledOnce).to.be.true;
    })
  });

  describe('onKeydown(event)', () => {
    let firstEl;
    let middleEl;
    let lastEl;
    let firstSpy;
    let middleSpy;
    let lastSpy;

    beforeEach(() => {
      element = document.createElement('div');
      firstEl = document.createElement('input');
      firstSpy = sinon.spy(firstEl, 'focus');
      element.appendChild(firstEl);
      middleEl = document.createElement('input');
      middleSpy = sinon.spy(middleEl, 'focus');
      element.appendChild(middleEl);
      lastEl = document.createElement('input');
      lastSpy = sinon.spy(lastEl, 'focus');
      element.appendChild(lastEl);
      document.body.appendChild(element);
      focusTrap = new FocusTrap(element);
    });

    it('ignores other keys', () => {
      const event = {
        target: firstEl,
        keyCode: 9999,
        preventDefault: sinon.spy(),
      };
      focusTrap.onKeydown(event);
      expect(firstSpy.notCalled).to.be.true;
      expect(middleSpy.notCalled).to.be.true;
      expect(lastSpy.notCalled).to.be.true;
      expect(event.preventDefault.notCalled).to.be.true;
    });

    it('skips to the first el when tabbing from the last el', () => {
      const event = {
        target: lastEl,
        keyCode: keyCodes.TAB,
        preventDefault: sinon.spy(),
        shiftKey: false,
      };
      focusTrap.onKeydown(event);
      expect(firstSpy.calledOnce).to.be.true;
      expect(middleSpy.notCalled).to.be.true;
      expect(lastSpy.notCalled).to.be.true;
      expect(event.preventDefault.calledOnce).to.be.true;
    });

    it('skips to the last el when shift-tabbing from the first el', () => {
      const event = {
        target: firstEl,
        keyCode: keyCodes.TAB,
        preventDefault: sinon.spy(),
        shiftKey: true,
      };
      focusTrap.onKeydown(event);
      expect(firstSpy.notCalled).to.be.true;
      expect(middleSpy.notCalled).to.be.true;
      expect(lastSpy.calledOnce).to.be.true;
      expect(event.preventDefault.calledOnce).to.be.true;
    });

    it('does nothing when tabbing from the middle el', () => {
      const event = {
        target: middleEl,
        keyCode: keyCodes.TAB,
        preventDefault: sinon.spy(),
        shiftKey: false,
      };
      focusTrap.onKeydown(event);
      expect(event.preventDefault.notCalled).to.be.true;
    });

    it('does nothing when shift-tabbing from the middle el', () => {
      const event = {
        target: middleEl,
        keyCode: keyCodes.TAB,
        preventDefault: sinon.spy(),
        shiftKey: true,
      };
      focusTrap.onKeydown(event);
      expect(event.preventDefault.notCalled).to.be.true;
    });

    it('focuses the first el when tabbing from outside', () => {
      const event = {
        target: document.createElement('div'),
        keyCode: keyCodes.TAB,
        preventDefault: sinon.spy(),
        shiftKey: true,
      };
      focusTrap.onKeydown(event);
      expect(firstSpy.calledOnce).to.be.true;
      expect(middleSpy.notCalled).to.be.true;
      expect(lastSpy.notCalled).to.be.true;
      expect(event.preventDefault.calledOnce).to.be.true;
    });
  });

  describe('findChildren()', () => {
    let firstEl;
    let middleEl;
    let lastEl;
    
    beforeEach(() => {
      element = document.createElement('div');
      firstEl = document.createElement('input');
      element.appendChild(firstEl);
      middleEl = document.createElement('input');
      element.appendChild(middleEl);
      lastEl = document.createElement('input');
      element.appendChild(lastEl);
      document.body.appendChild(element);
      focusTrap = new FocusTrap(element);
    });

    it('finds all focusable children', () => {
      expect(focusTrap.focusableChildren.length).to.equal(3);
    });

    it('sets firstFocusableChild', () => {
      expect(focusTrap.firstFocusableChild).to.equal(firstEl);
    });

    it('sets lastFocusableChild', () => {
      expect(focusTrap.lastFocusableChild).to.equal(lastEl);
    });

    it('finds all elements you can tab to', () => {
      element = document.createElement('div');
      document.body.appendChild(element);

      const formElements = [
        document.createElement('input'),
        document.createElement('select'),
        document.createElement('textarea'),
        document.createElement('button'),
        document.createElement('object'),
      ];

      const contentEditable = document.createElement('div');

      function createAndSetAttr(tag, attr, val) {
        const el = document.createElement(tag);
        el.setAttribute(attr, val);
        return el;
      }

      function cloneAndSetAttr(el, attr, val) {
        var newEl = el.cloneNode();
        newEl.setAttribute(attr, val);
        return newEl;
      }

      const tabbable = [
        ...formElements,
        createAndSetAttr('a', 'href', '#'),
        createAndSetAttr('area', 'href', '#'),
        document.createElement('iframe'),
        document.createElement('audio'),
        document.createElement('video'),
        createAndSetAttr('div', 'contentEditable', ''),
        createAndSetAttr('div', 'contentEditable', 'true'),
        createAndSetAttr('div', 'tabindex', '0'),
      ];

      const notTabbable = [
        ...formElements.map((el) => cloneAndSetAttr(el, 'disabled', 'disabled')),
        createAndSetAttr('div', 'contentEditable', 'false'),
        ...tabbable.map((el) => cloneAndSetAttr(el, 'tabindex', '-1')),
      ];

      [...tabbable, ...notTabbable].forEach((el) => {
        element.appendChild(el);
      });

      focusTrap = new FocusTrap(element);

      expect(focusTrap.focusableChildren).to.have.members(tabbable);
      expect(focusTrap.focusableChildren).not.to.include.members(notTabbable);
    });
  });
});
