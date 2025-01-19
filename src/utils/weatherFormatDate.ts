export const weatherFormatDate = (date: string) => {
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  return `${month}/${day}`;
};
