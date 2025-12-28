import { useState, useEffect, useRef } from 'react';

export const usePollTimer = (initialTime, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp]);

  const start = (time) => {
    setTimeLeft(time || initialTime);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = (time) => {
    setTimeLeft(time || initialTime);
    setIsRunning(false);
  };

  return { timeLeft, isRunning, start, stop, reset };
};