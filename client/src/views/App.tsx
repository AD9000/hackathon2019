import React, { useState, useEffect } from "react";
import { Map, TileLayer, CircleMarker, Marker, Popup } from "react-leaflet";
import {
  Dimmer,
  Button,
  Header,
  Icon,
  Segment,
  Label,
  Modal
} from "semantic-ui-react";
import { distanceInWordsToNow, addMinutes, isAfter } from "date-fns";

import { useGeolocation } from "../useGeolocation";
import { useRefHeight } from "../useRefHeight";
import { useDefaultValue } from "../useDefaultValue";
import { getCoord } from "../types";
import { getBusTimes, BusTimesData, busStopExists, IBusData } from "../api/api";
import { useInterval } from "../useInterval";

const App: React.FC = () => {
  const { position, error, requestLocationData } = useGeolocation();
  const { height, ref } = useRefHeight<HTMLDivElement>();
  const defaultPos = useDefaultValue(position);

  const [busData, setBusData] = useState<BusTimesData>();
  const [flaggedBus, setFlaggedBus] = useState<IBusData>();

  const defaultCoords = defaultPos ? getCoord(defaultPos) : undefined;
  const coords = position ? getCoord(position) : undefined;
  // const coords: [number, number] = [-33.8994644, 151.1023385];
  // const defaultCoords = coords;

  useEffect(() => {
    const call = async () => {
      if (defaultPos) {
        const busTimes = await getBusTimes([-33.8994644, 151.1023385]);
        // const busTimes = await getBusTimes(getCoord(defaultPos));
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
              {busStopExists(busData)
                ? busData.stop.name
                : "No nearby bus stops"}
            </Header>
          </Segment>
          <div className="scroll-list">
            {busStopExists(busData) &&
              busData.buses.map((bus, i) => {
                const busTime =
                  bus.departureTimeEstimated || bus.departureTimePlanned;
                return (
                  <Segment attached key={i}>
                    <Label horizontal>{bus.transportation.number}</Label>
                    <b>{bus.transportation.destination.name} </b>
                    {distanceInWordsToNow(busTime)}
                    <Button
                      floated="right"
                      circular
                      icon="hand paper outline"
                      color="violet"
                      inverted
                      active={
                        flaggedBus &&
                        bus.departureTimePlanned ===
                          flaggedBus.departureTimePlanned
                      }
                      style={{ marginTop: -8 }}
                      onClick={() => setFlaggedBus(bus)}
                      disabled={isAfter(busTime, addMinutes(Date.now(), 150))}
                    />
                  </Segment>
                );
              })}
          </div>
        </div>
      </div>
      <Modal basic size="small" open={Boolean(flaggedBus)}>
        <Header as="h2" icon>
          <Icon name="bus" />
        </Header>
        {flaggedBus ? (
          <>
            <Header textAlign="center">
              Flagged {flaggedBus.transportation.number}
              {" - "}
              <b>{flaggedBus.transportation.destination.name} </b>
            </Header>
            <Header
              textAlign="center"
              content={`Arriving in ${distanceInWordsToNow(
                flaggedBus.departureTimeEstimated ||
                  flaggedBus.departureTimePlanned
              )}`}
            />
          </>
        ) : (
          "Loading..."
        )}

        <br />
        <br />
        <Modal.Actions style={{ display: "flex", justifyContent: "center" }}>
          <Button
            size="big"
            color="red"
            inverted
            onClick={() => setFlaggedBus(undefined)}
          >
            <Icon name="hand lizard outline" /> Unflag
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export { App };
