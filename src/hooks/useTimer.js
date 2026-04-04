import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer({ duration, onExpire, isRunning }) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const startTimeRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!isRunning) return;
    setTimeRemaining(duration);
    startTimeRef.current = Date.now();

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
  }, [duration, isRunning]);

  const reset = useCallback(() => {
    setTimeRemaining(duration);
    startTimeRef.current = Date.now();
  }, [duration]);

  const addTime = useCallback((seconds) => {
    if (startTimeRef.current) {
      startTimeRef.current += seconds * 1000;
    }
  }, []);

  return {
    timeRemaining,
    percentage: duration > 0 ? (timeRemaining / duration) * 100 : 0,
    reset,
    addTime,
  };
}
