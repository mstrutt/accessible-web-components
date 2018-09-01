import rafPromise from './raf-promise.js';

/**
 * Simple linear easing function to be the default
 * @param {number} fraction The animation fraction
 * @return {number} passing the fraction right through
 */
function defaultEasing(fraction) {
  return fraction;
}

/**
 * The AnimationLoop Class
 * @export
 */
export default class AnimationLoop {
  /**
   * Constructor to initialise the animation loop
   * @param {function(number, number)} callback Takes the eased fraction of the animation as the primary argument and the duration of the animation so far as the secondary
   * @param {number} duration The duration of the animation in ms
   * @param {function(number): number=} easing Optional easing function for the animation
   */
  constructor(callback, duration, easing=defaultEasing) {
    this.callback = callback;
    this.duration = duration;
    this.easing = easing;

    this.stopped = true;
    this.paused = false;
    this.progressMs = 0;
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Start the animation
   */
  start() {
    this.startTime = performance.now();
    this.endTime = this.startTime + this.duration;
    this.stopped = false;
    this.paused = false;
    this.tick(this.startTime);
  }

  /**
   * Callback for a single frame of the animation
   * @param {number} timestamp When this tick of the animation is happening
   * @return {Promise} a promise that will resolves either with a new frame
   *           promise or once the animaion stops or pauses
   */
  tick(timestamp) {
    if (this.stopped || this.paused) {
      return null;
    }

    if (timestamp >= this.endTime) {
      this.callback(1, this.duration);
      this.stop();
      return null;
    }

    this.progressMs = timestamp - this.startTime;
    const progressPercent = this.progressMs / this.duration;
    const progressEased = this.easing(progressPercent);

    this.callback(progressEased, this.progressMs);

    return rafPromise()
      .then((nextTimestamp) => {
        return this.tick(nextTimestamp);
      });
  }

  /**
   * Pause an animation to resume later
   */
  pause() {
    this.paused = true;
  }

  /**
   * Resume a paused animation
   */
  resume() {
    const now = performance.now();
    this.startTime = now - this.progressMs;
    this.endTime = this.startTime + this.duration;
    this.paused = false;
    this.tick(now);
  }

  /*
   * Ends the animation where it is. Cannot be resumed but can be restarted
   */
  stop() {
    this.stopped = true;
    this.paused = false;
    this.progressMs = 0;
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Resets references and stops any animation
   */
  destroy() {
    this.stop();
    this.callback = null;
    this.duration = null;
    this.easing = null;
  }
};
