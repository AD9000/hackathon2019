import { useEffect, useRef } from "react";

export const useInterval = (callback: Function, delay?: number) => {
  const savedCallback = useRef<Function>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay) {
      const tick = () => {
        savedCallback.current();
      };
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
