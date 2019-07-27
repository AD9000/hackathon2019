import { safeFetch } from "../safeFetch";
import { Coord } from "../views/App";

const URL = "";

interface IBusData {}

interface IBusStopData {
  name: string;
  buses: IBusData[];
}

export const getBusTimes = async (
  coord: Coord
): Promise<IBusStopData | undefined> => {
  const result = await safeFetch<IBusStopData>(
    `${URL}/?lat=${coord[0]}&long=${coord[1]}`
  );

  if (result instanceof Error) {
    return undefined;
  }

  return result;
};
