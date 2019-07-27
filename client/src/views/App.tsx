import React, { useState, useEffect } from "react";

import { useGeolocation } from "../useGeolocation";
import { useDefaultValue } from "../useDefaultValue";
import { getCoord } from "../types";
import { getBusTimes, BusTimesData, IBusData } from "../api/api";
import { useInterval } from "../useInterval";
import { BusMap } from "./BusMap";
import { BusList } from "./BusList";
import { FlaggedModal } from "./FlaggedModal";

const App: React.FC = () => {
  const { position, error, requestLocationData } = useGeolocation();
  const defaultPos = useDefaultValue(position);

  const [busData, setBusData] = useState<BusTimesData>();
  const [flaggedBus, setFlaggedBus] = useState<IBusData>();

  const defaultCoords = defaultPos ? getCoord(defaultPos) : undefined;
  const coords = position ? getCoord(position) : undefined;

  useEffect(() => {
    const call = async () => {
      if (defaultPos) {
        const busTimes = await getBusTimes(getCoord(defaultPos));
        setBusData(busTimes);
      }
    };

    call();
  }, [defaultPos]);

  useInterval(async () => {
    if (coords) {
      const busTimes = await getBusTimes(coords);
      setBusData(busTimes);
    }
  }, 60000);

  return (
    <>
      <div className="grid">
        <BusMap
          defaultCoords={defaultCoords}
          coords={coords}
          busData={busData}
          error={error}
          requestLocationData={requestLocationData}
        />
        <BusList
          busData={busData}
          flaggedBus={flaggedBus}
          setFlaggedBus={setFlaggedBus}
        />
      </div>
      <FlaggedModal flaggedBus={flaggedBus} setFlaggedBus={setFlaggedBus} />
    </>
  );
};

export { App };
