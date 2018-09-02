import Modal from './utils/modal.js';

const modalEl = document.querySelector('.modal');
const modalTrigger = document.querySelector('.modal-trigger');

const modal = new Modal(modalEl);

modalTrigger.addEventListener('click', () => {
  if (modal.isOpen) {
    modal.close();
  } else {
    modal.open();
  }
});
