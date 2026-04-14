class AnimationEngine {
  constructor(steps, speed = 500) {
    this.steps = steps;
    this.currentIndex = 0;
    this.speed = speed;
    this.isPlaying = false;
    this.timer = null;
    this.onStepChange = null;
  }

  play() {
    if (this.isPlaying || this.isLastStep()) return;
    this.isPlaying = true;
    this.timer = setInterval(() => {
      if (this.isLastStep()) {
        this.pause();
      } else {
        this.next();
      }
    }, this.speed);
    this._notify();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this._notify();
  }

  next() {
    if (this.isLastStep()) return;
    this.currentIndex++;
    this._notify();
  }

  prev() {
    if (this.isFirstStep()) return;
    this.currentIndex--;
    this._notify();
  }

  reset() {
    this.currentIndex = 0;
    this.pause();
    this._notify();
  }

  goTo(i) {
    if (i >= 0 && i < this.steps.length) {
      this.currentIndex = i;
      this._notify();
    }
  }

  setSpeed(ms) {
    this.speed = ms;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  isFirstStep() {
    return this.currentIndex === 0;
  }

  isLastStep() {
    return this.currentIndex === this.steps.length - 1;
  }

  _notify() {
    if (this.onStepChange) {
      this.onStepChange();
    }
  }
}

export default AnimationEngine;
