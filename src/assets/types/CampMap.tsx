export interface CampMap {
  id: number;
  factDivNm: string;
  distance: number;
  location: { coordinates: number[]; type: string };
}
