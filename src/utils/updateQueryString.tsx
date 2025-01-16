export const updateQueryString = (
  paramsToUpdate: Record<string, string | null>
) => {
  const params = new URLSearchParams(window.location.search);

  Object.entries(paramsToUpdate).forEach(([key, value]) => {
    if (value !== null) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  const queryString = params.toString();
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.replaceState(null, '', newUrl);
};
