type NullableString = string | null;

interface CampLocation {
  type: NullableString;
  coordinates: [number, number] | null;
}

export interface CampImage {
  id: number;
  url: string;
}

export interface Camp extends CampLocation {
  id: number;
  contentId: string;
  firstImageUrl: NullableString;
  facltNm: string; // 야영장 명
  addr1: string; // 주소
  addr2: NullableString; // 상세주소
  doNm: NullableString; // 지역: 서울, 경기도 ...
  signguNm: NullableString; // --시
  lineIntro: NullableString; // 한줄 소개
  intro: NullableString; // 소개
  favorite: boolean;
}

export interface CampMap extends Camp {
  location: { coordinates: number[]; type: string };
}

export interface CampDetail extends Camp {
  bizrno: NullableString; // 사업자 번호
  manageSttus: NullableString; // 운영 상태, 관리 상태
  hvofBgnde: NullableString; // 휴장, 휴무 기간 시작일
  hvofEndde: NullableString; // 휴장, 휴무 기간 종료일
  induty: NullableString; // 업종: 일반 야영장, 글램핑, 카라반 ...
  lccl: NullableString; // 입지구분: 산, 호수 ...
  tel: NullableString; // 연락처
  homepage: NullableString; // 홈페이지
  gplnInnerFclty: NullableString; // 글램핑 내부시설
  caravnInnerFclty: NullableString; // 카라반 내부시설
  operPdCl: NullableString; // 운영기간
  operDeCl: NullableString; // 운영일
  trlerAcmpnyAt: NullableString; // 개인 트레일러 동반 여부 Y: 사용 N: 미사용
  caravAcmpnyAt: NullableString; // 개인 카라반 동반 여부 Y: 사용 N: 미사용
  sbrsCl: NullableString; // 부대시설
  toiletCo: NullableString; // 화장실 개수
  swrmCo: NullableString; // 샤워실 개수
  posblFcltyCl: NullableString; // 주변 이용 가능 시설
  themaEnvrnCl: NullableString; // 테마 환경
  eqpmnLendCl: NullableString; // 캠핑장비 대여
  animalCmgCl: NullableString; // 반려동물 - 가능 / 불가능
  images: CampImage[] | null;
  location: CampLocation | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: boolean;
  factDivNm: string; // 사업주체 구분: 민간 ...
  manageDivNm: NullableString; // 관리주체 구분: 직영, 위탁 ...
}
