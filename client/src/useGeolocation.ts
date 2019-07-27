import { useState, useEffect } from "react";

interface IGeolocationHook {
  position?: Position;
  error?: string;
  requestLocationData(): void;
}

export const useGeolocation = (): IGeolocationHook => {
  const [position, setPosition] = useState<Position>();
  const [error, setError] = useState<string>();
  const [watchId, setWatchId] = useState<number>();

  const requestLocationData = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in your browser.");
    } else {
      setWatchId(
        navigator.geolocation.watchPosition(setPosition, err =>
          setError(err.message)
        )
      );
    }
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    position,
    error,
    requestLocationData
  };
};
