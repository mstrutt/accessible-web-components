import rafPromise from './raf-promise.js';

/**
 * a Promise that resolves once the target transition has ended
 * @param {Element} element The element that will transition
 * @param {string} property The name of the property that will transition
 * @return {Promise}
 */
export default function(element, property) {
  return new Promise((resolve) => {
    function onTransitionEnd(event) {
      if (event.propertyName !== property) {
        return;
      }

      element.removeEventListener('transitionend', onTransitionEnd);
      resolve();
    }

    // Check if the element actually has a non-zero transition for this property
    const computedStyle = window.getComputedStyle(element);
    const transitionDurations = computedStyle['transition-duration'];
    const transitionProps = computedStyle['transition-property'];
    const index = transitionProps.indexOf(property);
    const hasDuration = parseFloat(transitionDurations[index]) > 0;
    
    if (hasDuration) {
      element.addEventListener('transitionend', onTransitionEnd);
    } else {
      // There is no transition, resolve in the next frame
      resolve(rafPromise());
    }
  }); 
};
