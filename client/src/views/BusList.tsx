import React from "react";
import { Segment, Header, Label, Button } from "semantic-ui-react";

import { busStopExists, BusTimesData, IBusData } from "../api/api";
import { distanceInWordsToNow, isAfter, addMinutes } from "date-fns";

interface IBusListProps {
  busData?: BusTimesData;
  flaggedBus?: IBusData;
  setFlaggedBus(bus: IBusData): void;
}

export const BusList: React.FC<IBusListProps> = props => {
  const { busData, flaggedBus, setFlaggedBus } = props;

  return (
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
                    bus.departureTimePlanned === flaggedBus.departureTimePlanned
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
  );
};
