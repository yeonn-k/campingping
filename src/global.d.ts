// kakao에서 typescript 지원하지 않는 문제에 대해 이렇게 처리해 두라고 함.

declare global {
  export interface Window {
    kakao: any;
  }
}
