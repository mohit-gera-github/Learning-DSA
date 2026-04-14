import { useState, useRef, useEffect, useCallback } from 'react';
import AnimationEngine from './AnimationEngine';

export const useAnimation = (steps, initialSpeed = 500) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const engineRef = useRef(null);

  if (!engineRef.current) {
    engineRef.current = new AnimationEngine(steps, initialSpeed);
  }

  useEffect(() => {
    engineRef.current.steps = steps;
    if (engineRef.current.currentIndex >= steps.length) {
      engineRef.current.reset();
    }
  }, [steps]);

  useEffect(() => {
    const engine = engineRef.current;
    engine.onStepChange = () => {
      setCurrentIndex(engine.currentIndex);
      setIsPlaying(engine.isPlaying);
    };

    return () => {
      engine.pause();
      engine.onStepChange = null;
    };
  }, []);

  const play = useCallback(() => engineRef.current.play(), []);
  const pause = useCallback(() => engineRef.current.pause(), []);
  const next = useCallback(() => engineRef.current.next(), []);
  const prev = useCallback(() => engineRef.current.prev(), []);
  const reset = useCallback(() => engineRef.current.reset(), []);
  const goTo = useCallback((i) => engineRef.current.goTo(i), []);
  const setSpeed = useCallback((ms) => engineRef.current.setSpeed(ms), []);

  return {
    currentStep: steps[currentIndex],
    currentIndex,
    isPlaying,
    play,
    pause,
    next,
    prev,
    reset,
    goTo,
    setSpeed,
    totalSteps: steps.length,
  };
};

export default useAnimation;
