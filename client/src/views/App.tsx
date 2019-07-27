import React, { useState, useRef, useEffect } from "react";
import { Map, TileLayer, CircleMarker } from "react-leaflet";
import { Dimmer, Button, Header, Icon, Segment } from "semantic-ui-react";

import { useGeolocation } from "../useGeolocation";

export type Coord = [number, number];

const getCoord = (pos: Position): Coord => {
  const { latitude, longitude } = pos.coords;
  return [latitude, longitude];
};

const App: React.FC = () => {
  const { position, requestLocationData } = useGeolocation();
  const [defaultPos, setDefaultPos] = useState<Position>();
  const [mapHeight, setMapHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!defaultPos) {
      setDefaultPos(position);
    }
  }, [defaultPos, position]);

  useEffect(() => {
    const resize = () =>
      setMapHeight(ref.current ? ref.current.clientHeight : 0);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (!mapHeight && ref.current) {
    setMapHeight(ref.current.clientHeight);
  }

  const defaultCoords = defaultPos ? getCoord(defaultPos) : undefined;
  const coords = position ? getCoord(position) : undefined;

  return (
    <div className="grid">
      <Dimmer.Dimmable>
        <div className="map" ref={ref}>
          <Map center={defaultCoords} zoom={17} style={{ height: mapHeight }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {coords && (
              <CircleMarker center={coords} fillColor="blue" radius={10} />
            )}
          </Map>
          <Dimmer active={!position}>
            <Header as="h3" inverted icon>
              <Icon name="location arrow" />
              App needs your location data
            </Header>
            <br />
            <Button onClick={requestLocationData}>Request Data</Button>
          </Dimmer>
        </div>
      </Dimmer.Dimmable>
      <div className="list">
        <Segment color="blue" attached>
          <Header as="h3">UNSW Gate 14, Barker St</Header>
        </Segment>
        <Segment attached>This segment is on top</Segment>
        <Segment attached>This segment is attached on both sides</Segment>
        <Segment attached>This segment is on bottom</Segment>
        <Segment attached>This segment is on top</Segment>
        <Segment attached>This segment is attached on both sides</Segment>
        <Segment attached>This segment is on bottom</Segment>
      </div>
    </div>
  );
};

export { App };
