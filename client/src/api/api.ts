import { safeFetch } from "../safeFetch";
import { Coord } from "../types";

const URL = "http://localhost:5000";

export interface IBusStopData {}

export interface IBusData {}

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
    console.log("error!");
    return {};
  }

  return result;
};
