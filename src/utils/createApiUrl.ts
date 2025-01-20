export const createApiUrl = (
  baseUrl: string,
  paramsList: { name: string; value?: string | number | null }[]
) => {
  const params = new URLSearchParams();

  paramsList.forEach(({ name, value }) => {
    if (value) {
      params.set(name, `${value}`);
    } else {
      params.delete(name);
    }
  });

  return `${baseUrl}?${params.toString()}`;
};
