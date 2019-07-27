import { safeFetch, safePost } from "../safeFetch";
import { Coord } from "../types";

const URL = "http://localhost:5000";

export const busStopExists = (
  x: BusTimesData | undefined
): x is IBusTimesData => {
  return Boolean(x && (x as IBusTimesData).stop);
};

export interface IBusStopData {
  coord: Coord;
  id: string;
  name: string;
}

export interface IBusData {
  departureTimeEstimated?: string;
  departureTimePlanned: string;
  properties: {
    AVMSTripID: string;
    PlanLowFloorVehicle: "1";
    PlanWheelChairAccess: "1";
    WheelchairAccess: "true" | "false";
  };
  transportation: {
    description: string;
    number: string;
    destination: {
      name: string;
    };
    properties: {
      tripCode: number;
    };
  };
}

export interface IBusTimesData {
  stop: IBusStopData;
  buses: IBusData[];
}

export type BusTimesData = IBusTimesData | {};

export const getBusTimes = async (
  coord: Coord
): Promise<BusTimesData | undefined> => {
  const result = await safeFetch<BusTimesData>(
    `${URL}/?lat=${coord[0]}&long=${coord[1]}`
  );

  console.log(result);
  if (result instanceof Error) {
    return {};
  }

  return result;
};

export const flagBus = async (
  busNumber: string,
  tripCode: number,
  stopId: string,
  flag: boolean
) => {
  await safePost(URL, undefined, {
    busNumber,
    tripCode,
    stopId,
    flag
  });
};
