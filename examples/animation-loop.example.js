import AnimationLoop from './utils/animation-loop.js';

const square = document.querySelector('.square');
const animate = document.querySelector('.animate');
const pause = document.querySelector('.pause');
const resume = document.querySelector('.resume');
const stop = document.querySelector('.stop');

const animation = new AnimationLoop(animateFrame, 2000);

animate.addEventListener('click', animateFn);
pause.addEventListener('click', pauseFn);
resume.addEventListener('click', resumeFn);
stop.addEventListener('click', stopFn);

function animateFn() {
  if (animation.stopped) {
    animation.start();
  }
}

function pauseFn() {
  if (!animation.stopped && !animation.paused) {
    animation.pause();
  }
}

function resumeFn() {
  if (animation.paused) {
    animation.resume();
  }
}

function stopFn() {
  if (!animation.stopped) {
    animation.stop();
    animateFrame(0, 0);
  }
}

function animateFrame(fraction, time) {
  console.debug(fraction, time);
  square.style.transform = `translateX(${400 * fraction}px)`;
}
