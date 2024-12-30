type NullableString = string | null;

interface CampLocation {
  type: NullableString;
  coordinates: [number, number];
}

export interface CampImage {
  id: number;
  url: string;
}

interface Camp {
  id: number;
  lineIntro: NullableString;
  intro: NullableString;
  factDivNm: string;
  manageDivNm: NullableString;
  bizrno: NullableString;
  manageSttus: NullableString;
  hvofBgnde: NullableString;
  hvofEndde: NullableString;
  featureNm: NullableString;
  induty: NullableString;
  lccl: NullableString;
  doNm: NullableString;
  signguNm: NullableString;
  addr1: NullableString;
  addr2: NullableString;
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
  contentId: string;
  location: CampLocation | null;
  images: CampImage | null;
}

export default Camp;
