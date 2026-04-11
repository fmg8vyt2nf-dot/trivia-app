import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer({ duration, onExpire, isRunning }) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [paused, setPaused] = useState(false);
  const startTimeRef = useRef(null);
  const pausedElapsedRef = useRef(0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!isRunning || paused) return;
    if (pausedElapsedRef.current > 0) {
      // Resuming from pause — adjust start time to preserve elapsed
      startTimeRef.current = Date.now() - pausedElapsedRef.current;
    } else {
      setTimeRemaining(duration);
      startTimeRef.current = Date.now();
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpireRef.current?.();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [duration, isRunning, paused]);

  // Reset pausedElapsed when a new question starts (duration/isRunning change)
  useEffect(() => {
    if (isRunning) {
      pausedElapsedRef.current = 0;
    }
  }, [duration, isRunning]);

  const pause = useCallback(() => {
    if (startTimeRef.current) {
      pausedElapsedRef.current = Date.now() - startTimeRef.current;
    }
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    setPaused(false);
  }, []);

  const reset = useCallback(() => {
    setTimeRemaining(duration);
    startTimeRef.current = Date.now();
    pausedElapsedRef.current = 0;
  }, [duration]);

  const addTime = useCallback((seconds) => {
    if (startTimeRef.current) {
      startTimeRef.current += seconds * 1000;
    }
  }, []);

  return {
    timeRemaining,
    percentage: duration > 0 ? (timeRemaining / duration) * 100 : 0,
    paused,
    pause,
    resume,
    reset,
    addTime,
  };
}
