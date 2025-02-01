// 사업자 번호 형식 (XXX-XX-XXXXX)
export const businessNumberRegex = /^\d{3}-\d{2}-\d{5}$/;

export const isBusinessNumber = (v: string) => {
  return !businessNumberRegex.test(v);
};
