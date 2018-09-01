/**
 * @return {Promise} a promise that resolves on the next animation frame.
 *                   The resolved value is the argument of the RAF callback (a timestamp)
 */
export default function rafPromise() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(resolve);
  });
}
