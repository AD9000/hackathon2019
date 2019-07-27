import React from "react";
import { Dimmer, Header, Button, Icon } from "semantic-ui-react";
import { Map, TileLayer, CircleMarker, Marker, Popup } from "react-leaflet";

import { busStopExists, BusTimesData } from "../api/api";
import { useRefHeight } from "../useRefHeight";
import { Coord } from "../types";

interface IBusMapProps {
  defaultCoords?: Coord;
  coords?: Coord;
  busData?: BusTimesData;
  error?: string;
  requestLocationData(): void;
}

export const BusMap: React.FC<IBusMapProps> = props => {
  const { height, ref } = useRefHeight<HTMLDivElement>();
  const { defaultCoords, coords, busData, error, requestLocationData } = props;

  return (
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
        <Dimmer active={!coords}>
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
  );
};
