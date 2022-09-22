export const sortByDate = (array) => {
  return array.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB < dateA ? -1 : 1;
  });
};
