type NullableString = string | null;

interface CampLocation {
  type: NullableString;
  coordinates: [number, number] | null;
}

export interface WishlistCamp {
  id: number;
  campingid: number;
  contentid: string;
  facltnm: string;
  addr1: string;
  addr2: string | null;
  donm: string | null;
  sigungunm: string | null;
  lineintro: string | null;
  intro: string | null;
  firstimageurl: string | null;
}

export interface CampImage {
  id: number;
  url: string;
}

export interface Camp extends CampLocation {
  id: number;
  contentId: string;
  firstImageUrl: NullableString;
  facltNm: string;
  addr1: string;
  addr2: NullableString;
  doNm: NullableString;
  signguNm: NullableString;
  lineIntro: NullableString;
  intro: NullableString;
  favorite: boolean;
}

export interface CampMap extends Camp {
  location: { coordinates: number[]; type: string };
}

export interface CampDetail extends Camp {
  bizrno: NullableString;
  manageSttus: NullableString;
  hvofBgnde: NullableString;
  hvofEndde: NullableString;
  induty: NullableString;
  lccl: NullableString;
  tel: NullableString;
  homepage: NullableString;
  gplnInnerFclty: NullableString;
  caravnInnerFclty: NullableString;
  operPdCl: NullableString;
  operDeCl: NullableString;
  trlerAcmpnyAt: NullableString;
  caravAcmpnyAt: NullableString;
  sbrsCl: NullableString;
  toiletCo: NullableString;
  swrmCo: NullableString;
  posblFcltyCl: NullableString;
  themaEnvrnCl: NullableString;
  eqpmnLendCl: NullableString;
  animalCmgCl: NullableString;
  images: CampImage[] | null;
  location: CampLocation | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: boolean;
  factDivNm: string;
  manageDivNm: NullableString;
}
