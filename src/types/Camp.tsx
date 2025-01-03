type NullableString = string | null;

interface CampLocation {
  type: NullableString;
  coordinates: [number, number];
}

export interface CampImage {
  id: number;
  url: string;
}

export interface Camp {
  id: number;
  contentId: string;
  fistImgeUrl: NullableString;
  facltNm: NullableString;
  addr1: NullableString;
  addr2: NullableString;
  doNm: NullableString;
  signguNm: NullableString;
  lineIntro: NullableString;
  intro: NullableString;
}

export interface CampDetail extends Camp {
  createdAt: string;
  updatedAt: string;
  deletedAt: boolean;
  factDivNm: string;
  manageDivNm: NullableString;
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
}
