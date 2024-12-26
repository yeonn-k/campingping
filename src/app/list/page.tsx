'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Category from '@/components/Category/Category';
import Card from '@/components/Card/Card';
import Nav from '@/components/Nav/Nav';
import Camp from '@/assets/types/Camp';

const fakeData: Camp[] = [
  {
    id: 4,
    lineIntro: '별보기 좋은 카라반 캠핑장',
    intro:
      '힐링피아 카라반 글램핑 풀 캠핑장은 어비계곡 사기막천과 유명산 벽계천이 합류하는 두물머리에 위치하고 있다. 카라반 데크의 크기는 휴식공간용과 바베큐공간을 분리 할 정도의 넓은 공간이고 각 카라반에 개별 수영장이 있다. 놀이시설로는 개별수영장 별도의 야외수영장, 어린이 암벽 ,하늘자전거,탁구대 등이 있으며, 힐링하기 좋은 전망대가 있어 밤에 별보기 좋은 카라반 캠핑장이다.',
    factDivNm: '힐링피아 카라반 글램핑 풀 캠핑장',
    manageDivNm: null,
    bizrno: '169-52-00647',
    manageSttus: '운영',
    hvofBgnde: null,
    hvofEndde: null,
    featureNm:
      '어비계곡 하류 합수점에 위치한 풀빌라형 카라반  힐링피아 카라반 글램핑 풀 캠핑장은 어비계곡 사기막천과 유명산 벽계천이 합류하는 두물머리에 위치하고 있다. 카라반 데크의 크기는 휴식공간용과 바베큐공간을 분리 할 정도의 넓은 공간이고 각 카라반에 개별 수영장이 있다. 놀이시설로는 개별수영장 별도의 야외수영장, 어린이 암벽 ,하늘자전거,탁구대 등이 있으며, 힐링하기 좋은 전망대가 있어 밤에 별보기 좋은 카라반 캠핑장이다. ',
    induty: '일반야영장',
    lccl: '산,숲,강',
    doNm: '경기도',
    signguNm: null,
    addr1: '경기 가평군 설악면 유명산길 61-75',
    addr2: null,
    tel: '010-3148-9970',
    homepage: 'http://healingpia.co.kr',
    gplnInnerFclty: '1',
    caravnInnerFclty: null,
    operPdCl: '봄,여름,가을,겨울',
    operDeCl: '평일+주말',
    trlerAcmpnyAt: 'N',
    caravAcmpnyAt: 'N',
    sbrsCl: '전기,무선인터넷,장작판매,온수,마트.편의점',
    toiletCo: '3',
    swrmCo: '2',
    posblFcltyCl: '계곡 물놀이,산책로,강/물놀이,수영장,청소년체험시설',
    themaEnvrnCl:
      '액티비티,봄꽃여행,여름물놀이,가을단풍명소,겨울눈꽃명소,걷기길',
    eqpmnLendCl: null,
    animalCmgCl: '불가능',
    contentId: '100002',
    location: {
      type: 'Point',
      coordinates: [127.4947241, 37.5978864],
    },
    images: {
      id: 607,
      url: 'https://gocamping.or.kr/upload/camp/100002/20339geHYKzGA9OjsoC0nFwX.jpg',
    },
  },
  {
    id: 5,
    lineIntro: null,
    intro:
      '우니메이카 태안점은 숲속 야영장으로 15개의 데크, 8개의 개별화장실을 보유하고 있으며 오래자란 소나무숲 그늘이 풍부하고 약5킬로거리에 서해안 최고의 만리포해수욕장과 모항항이 있어 숲과 바다를 함께 즐길 수있는 장점이 있습니다.',
    factDivNm: '우니메이카 태안점',
    manageDivNm: null,
    bizrno: '275-46-00714',
    manageSttus: '운영',
    hvofBgnde: null,
    hvofEndde: null,
    featureNm:
      '쭉 머물고픈 깊은 숲속 요새 같은 캠핑장  우니메이카 태안점은 충남 태안군 소원면 신덕리에 자리 잡았다. 태안군청을 기점으로 15km가량 떨어졌다. 자동차를 타고 서해로와 산간이길을 번갈아 달리면 닿는다. 도착까지 걸리는 시간은 20분 안팎이다. 캠핑장은 깊은 숲속에 위치하고 있어 요새 같은 느낌이다. 데크로 이뤄진 일반캠핑 사이트 15면이 마련돼 있으며, 사이트 크기는 가로 4m 세로 4m다. 사이트 간격이 무척 넓어 프라이빗한 캠핑을 만끽할 수 있다. 솔로 캠핑이나 미니멀 캠핑을 즐기는 캠퍼들이 열광할 만한 조건을 갖춘 셈이다. 게다가 개별 화장실과 샤워실을 사용할 수 있어 편리하다. 주변에는 만리포해수욕장과 만리포항이 있어 연계 관광에 나서기 수월하다.',
    induty: '자동차야영장',
    lccl: '숲',
    doNm: '충청남도',
    signguNm: null,
    addr1: '충남 태안군 소원면 산간이길 158-24',
    addr2: null,
    tel: '043-1668-3972',
    homepage: null,
    gplnInnerFclty: '15',
    caravnInnerFclty: null,
    operPdCl: '봄,여름,가을,겨울',
    operDeCl: '평일+주말',
    trlerAcmpnyAt: 'N',
    caravAcmpnyAt: 'N',
    sbrsCl: '전기,장작판매,온수,놀이터,운동시설',
    toiletCo: '15',
    swrmCo: '15',
    posblFcltyCl: '수상레저,낚시,해수욕',
    themaEnvrnCl: '봄꽃여행,가을단풍명소,겨울눈꽃명소',
    eqpmnLendCl: '화로대',
    animalCmgCl: '가능',
    contentId: '100003',
    location: {
      type: 'Point',
      coordinates: [126.1890914, 36.7796484],
    },
    images: {
      id: 627,
      url: 'https://gocamping.or.kr/upload/camp/100003/6517S9GUDxExcoVxf6fWGCxC.jpg',
    },
  },
  {
    id: 4,
    lineIntro: '별보기 좋은 카라반 캠핑장',
    intro:
      '힐링피아 카라반 글램핑 풀 캠핑장은 어비계곡 사기막천과 유명산 벽계천이 합류하는 두물머리에 위치하고 있다. 카라반 데크의 크기는 휴식공간용과 바베큐공간을 분리 할 정도의 넓은 공간이고 각 카라반에 개별 수영장이 있다. 놀이시설로는 개별수영장 별도의 야외수영장, 어린이 암벽 ,하늘자전거,탁구대 등이 있으며, 힐링하기 좋은 전망대가 있어 밤에 별보기 좋은 카라반 캠핑장이다.',
    factDivNm: '힐링피아 카라반 글램핑 풀 캠핑장',
    manageDivNm: null,
    bizrno: '169-52-00647',
    manageSttus: '운영',
    hvofBgnde: null,
    hvofEndde: null,
    featureNm:
      '어비계곡 하류 합수점에 위치한 풀빌라형 카라반  힐링피아 카라반 글램핑 풀 캠핑장은 어비계곡 사기막천과 유명산 벽계천이 합류하는 두물머리에 위치하고 있다. 카라반 데크의 크기는 휴식공간용과 바베큐공간을 분리 할 정도의 넓은 공간이고 각 카라반에 개별 수영장이 있다. 놀이시설로는 개별수영장 별도의 야외수영장, 어린이 암벽 ,하늘자전거,탁구대 등이 있으며, 힐링하기 좋은 전망대가 있어 밤에 별보기 좋은 카라반 캠핑장이다. ',
    induty: '일반야영장',
    lccl: '산,숲,강',
    doNm: '경기도',
    signguNm: null,
    addr1: '경기 가평군 설악면 유명산길 61-75',
    addr2: null,
    tel: '010-3148-9970',
    homepage: 'http://healingpia.co.kr',
    gplnInnerFclty: '1',
    caravnInnerFclty: null,
    operPdCl: '봄,여름,가을,겨울',
    operDeCl: '평일+주말',
    trlerAcmpnyAt: 'N',
    caravAcmpnyAt: 'N',
    sbrsCl: '전기,무선인터넷,장작판매,온수,마트.편의점',
    toiletCo: '3',
    swrmCo: '2',
    posblFcltyCl: '계곡 물놀이,산책로,강/물놀이,수영장,청소년체험시설',
    themaEnvrnCl:
      '액티비티,봄꽃여행,여름물놀이,가을단풍명소,겨울눈꽃명소,걷기길',
    eqpmnLendCl: null,
    animalCmgCl: '불가능',
    contentId: '100002',
    location: {
      type: 'Point',
      coordinates: [127.4947241, 37.5978864],
    },
    images: {
      id: 607,
      url: 'https://gocamping.or.kr/upload/camp/100002/20339geHYKzGA9OjsoC0nFwX.jpg',
    },
  },
  {
    id: 5,
    lineIntro: null,
    intro:
      '우니메이카 태안점은 숲속 야영장으로 15개의 데크, 8개의 개별화장실을 보유하고 있으며 오래자란 소나무숲 그늘이 풍부하고 약5킬로거리에 서해안 최고의 만리포해수욕장과 모항항이 있어 숲과 바다를 함께 즐길 수있는 장점이 있습니다.',
    factDivNm: '우니메이카 태안점',
    manageDivNm: null,
    bizrno: '275-46-00714',
    manageSttus: '운영',
    hvofBgnde: null,
    hvofEndde: null,
    featureNm:
      '쭉 머물고픈 깊은 숲속 요새 같은 캠핑장  우니메이카 태안점은 충남 태안군 소원면 신덕리에 자리 잡았다. 태안군청을 기점으로 15km가량 떨어졌다. 자동차를 타고 서해로와 산간이길을 번갈아 달리면 닿는다. 도착까지 걸리는 시간은 20분 안팎이다. 캠핑장은 깊은 숲속에 위치하고 있어 요새 같은 느낌이다. 데크로 이뤄진 일반캠핑 사이트 15면이 마련돼 있으며, 사이트 크기는 가로 4m 세로 4m다. 사이트 간격이 무척 넓어 프라이빗한 캠핑을 만끽할 수 있다. 솔로 캠핑이나 미니멀 캠핑을 즐기는 캠퍼들이 열광할 만한 조건을 갖춘 셈이다. 게다가 개별 화장실과 샤워실을 사용할 수 있어 편리하다. 주변에는 만리포해수욕장과 만리포항이 있어 연계 관광에 나서기 수월하다.',
    induty: '자동차야영장',
    lccl: '숲',
    doNm: '충청남도',
    signguNm: null,
    addr1: '충남 태안군 소원면 산간이길 158-24',
    addr2: null,
    tel: '043-1668-3972',
    homepage: null,
    gplnInnerFclty: '15',
    caravnInnerFclty: null,
    operPdCl: '봄,여름,가을,겨울',
    operDeCl: '평일+주말',
    trlerAcmpnyAt: 'N',
    caravAcmpnyAt: 'N',
    sbrsCl: '전기,장작판매,온수,놀이터,운동시설',
    toiletCo: '15',
    swrmCo: '15',
    posblFcltyCl: '수상레저,낚시,해수욕',
    themaEnvrnCl: '봄꽃여행,가을단풍명소,겨울눈꽃명소',
    eqpmnLendCl: '화로대',
    animalCmgCl: '가능',
    contentId: '100003',
    location: {
      type: 'Point',
      coordinates: [126.1890914, 36.7796484],
    },
    images: {
      id: 627,
      url: 'https://gocamping.or.kr/upload/camp/100003/6517S9GUDxExcoVxf6fWGCxC.jpg',
    },
  },
];

const List = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || '전체'
  );
  const [campingData, setCampingData] = useState<Camp[] | null>();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (selectedCategory === '전체') {
      router.push(`/list`);
    } else {
      router.push(`/list?${createQueryString('category', selectedCategory)}`);
    }
  }, [createQueryString, router, selectedCategory]);

  const fetchCampingData = useCallback(async () => {
    try {
      const apiUrl =
        selectedCategory === '전체'
          ? 'http://localhost:3000/campings/lists'
          : `http://localhost:3000/campings/lists?category=${selectedCategory}`; // <= this api has been defined yet...(need to edit)
      // const response = await fetch(apiUrl);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch data');
      // }
      // const data = await response.json();
      // setCampingData(data);
      setCampingData(fakeData);
    } catch (error) {
      console.error(error); //error 이렇게 콘솔로 처리해야하는지... logger로 사용해 놓을지...
    }
  }, [selectedCategory]);

  console.log(campingData);
  useEffect(() => {
    fetchCampingData();
  }, [fetchCampingData]);

  const handleCategorySelected = useCallback((categoryName: string) => {
    setSelectedCategory(categoryName);
  }, []);

  return (
    <div className="flex flex-colw-[390px] ">
      <Category
        selectedCategory={selectedCategory}
        onCategorySelected={handleCategorySelected}
      />

      <div className="w-[390px]">
        {campingData !== null ? (
          campingData?.map((camp) => (
            <Card
              key={camp.id}
              itemId={camp.contentId}
              liked={false}
              imgSrc={camp.images?.url || ''}
              name={camp.factDivNm}
              address={`${camp.addr1} ${camp.addr2}` || ''}
              description={camp.lineIntro || ''}
            />
          ))
        ) : (
          <p>검색 결과가 없습니다</p>
        )}
      </div>

      <Nav />
    </div>
  );
};

export default List;
