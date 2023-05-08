export const formatPages = (pages: any[] | undefined) => {
  if (!pages) return [];
  return pages?.reduce((acc: any[], cur) => [...acc, ...cur.data], []);
};
