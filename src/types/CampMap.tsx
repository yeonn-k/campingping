export interface CampMap {
  id: number;
  contentId: string;
  firstImageUrl: string | null;
  facltNm: string;
  addr1: string;
  addr2: string | null;
  doNm: string;
  sigunguNm: string;
  lineIntro: string | null;
  intro: string | null;
  favorite: boolean;
  location: { coordinates: number[]; type: string };
}
