import React, { useState, useEffect } from "react";
import { Map, TileLayer, CircleMarker, Marker, Popup } from "react-leaflet";
import { Dimmer, Button, Header, Icon, Segment } from "semantic-ui-react";
import { distanceInWordsToNow, addMinutes, isAfter } from "date-fns";

import { useGeolocation } from "../useGeolocation";
import { useRefHeight } from "../useRefHeight";
import { useDefaultValue } from "../useDefaultValue";
import { getCoord } from "../types";
import {
  getBusTimes,
  BusTimesData,
  busStopExists,
  flagBus,
  IBusData,
  IBusStopData
} from "../api/api";
import { useInterval } from "../useInterval";

const App: React.FC = () => {
  const { position, error, requestLocationData } = useGeolocation();
  const { height, ref } = useRefHeight<HTMLDivElement>();
  const defaultPos = useDefaultValue(position);

  const [busData, setBusData] = useState<BusTimesData>();

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

  const handleFlagBus = (stop: IBusStopData, bus: IBusData) => {
    const {
      transportation: {
        number,
        properties: { tripCode }
      }
    } = bus;
    const { id } = stop;
    flagBus(number, tripCode, id, true);
  };

  return (
    <div className="grid">
      <div className="map" ref={ref}>
        <Dimmer.Dimmable style={{ height: "100%" }}>
          <Map center={defaultCoords} zoom={17} style={{ height }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {coords && (
              <CircleMarker center={coords} fillColor="purple" radius={10} />
            )}
            {busStopExists(busData) && (
              <Marker position={busData.stop.coord}>
                <Popup>{busData.stop.name}</Popup>
              </Marker>
            )}
          </Map>
          <Dimmer active={!position}>
            {error ? (
              <Header as="h3" inverted icon>
                <Icon name="close" />
                {error}
              </Header>
            ) : (
              <Header as="h3" inverted icon>
                <Icon name="location arrow" />
                App needs your location data
              </Header>
            )}
            <br />
            <Button onClick={requestLocationData}>Request Data</Button>
          </Dimmer>
        </Dimmer.Dimmable>
      </div>
      <div className="list">
        <Segment color="violet" attached>
          <Header as="h3">
            {busStopExists(busData) ? busData.stop.name : "No nearby bus stops"}
          </Header>
        </Segment>
        <div className="scroll-list">
          {busStopExists(busData) &&
            busData.buses.map((bus, i) => {
              const busTime =
                bus.departureTimeEstimated || bus.departureTimePlanned;
              return (
                <Segment attached key={i}>
                  {bus.transportation.number}{" "}
                  {bus.transportation.destination.name}{" "}
                  {distanceInWordsToNow(busTime)}
                  <Button
                    floated="right"
                    circular
                    icon="hand paper outline"
                    color="violet"
                    inverted
                    style={{ marginTop: -8 }}
                    onClick={handleFlagBus.bind(undefined, busData.stop, bus)}
                    disabled={isAfter(busTime, addMinutes(Date.now(), 15))}
                  />
                </Segment>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export { App };
