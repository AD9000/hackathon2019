import React, { useState } from "react";
import { Map, TileLayer, CircleMarker } from "react-leaflet";
import { Dimmer, Button, Header, Icon, Segment } from "semantic-ui-react";

import { useGeolocation } from "../useGeolocation";
import { useRefHeight } from "../useRefHeight";
import { useDefaultValue } from "../useDefaultValue";
import { getCoord } from "../types";
import { getBusTimes, BusTimesData } from "../api/api";
import { useInterval } from "../useInterval";

const App: React.FC = () => {
  const { position, error, requestLocationData } = useGeolocation();
  const { height, ref } = useRefHeight<HTMLDivElement>();
  const defaultPos = useDefaultValue(position);

  const [busData, setBusData] = useState<BusTimesData>();

  const defaultCoords = defaultPos ? getCoord(defaultPos) : undefined;
  const coords = position ? getCoord(position) : undefined;

  const getBusData = async () => {
    if (coords) {
      const busTimes = await getBusTimes(coords);
      setBusData(busTimes);
    }
  };

  useInterval(() => {
    getBusData();
  }, 60000);

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
              <CircleMarker center={coords} fillColor="blue" radius={10} />
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
        <Segment color="blue" attached>
          <Header as="h3">UNSW Gate 14, Barker St</Header>
        </Segment>
        <div className="scroll-list">
          <Segment attached>This segment is on top</Segment>
          <Segment attached>This segment is attached on both sides</Segment>
          <Segment attached>This segment is on bottom</Segment>
          <Segment attached>This segment is on top</Segment>
          <Segment attached>This segment is attached on both sides</Segment>
          <Segment attached>This segment is on bottom</Segment>
        </div>
      </div>
    </div>
  );
};

export { App };
