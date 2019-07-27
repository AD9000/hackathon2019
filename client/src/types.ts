export type Coord = [number, number];
export const getCoord = (pos: Position): Coord => {
  const { latitude, longitude } = pos.coords;
  return [latitude, longitude];
};
