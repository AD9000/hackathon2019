import React from "react";
import { Modal, Header, Icon, Button } from "semantic-ui-react";

import { distanceInWordsToNow } from "date-fns";
import { IBusData } from "../api/api";

interface IFlaggedModalProps {
  flaggedBus?: IBusData;
  setFlaggedBus(bus: IBusData | undefined): void;
}

export const FlaggedModal: React.FC<IFlaggedModalProps> = props => {
  const { flaggedBus, setFlaggedBus } = props;
  return (
    <Modal basic size="small" open={Boolean(flaggedBus)}>
      <Header as="h2" icon>
        <Icon name="bus" />
      </Header>
      {flaggedBus && (
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
  );
};
