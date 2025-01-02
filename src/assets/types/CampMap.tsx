export interface CampMap {
  id: number;
  contentId: string;
  factDivNm: string;
  distance: number;
  favorite: boolean;
  imageUrl: string | null;
  lineinto: string;
  addr1: string;
  location: { coordinates: number[]; type: string };
}
