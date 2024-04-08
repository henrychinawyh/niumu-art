/**
 * @name 倒计时hooks
 */

import { useEffect, useState } from 'react';

const useCountDown = (initialSeconds: number): [number, boolean, () => void, () => void] => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }

    return () => clearInterval(intervalId);
  }, [isActive, seconds]);

  const start = () => {
    setIsActive(true);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  return [seconds, isActive, start, reset];
};

export default useCountDown;
