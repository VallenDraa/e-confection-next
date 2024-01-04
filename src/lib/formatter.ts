export const rupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);

export const getWeekYearKey = (date: Date) => {
  const weekNumber = getISOWeek(date);
  const year = date.getFullYear();
  return `Week ${weekNumber} - ${year}`;
};

export const getISOWeek = (date: Date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const differenceInMilliseconds = date.getTime() - startOfYear.getTime();
  const weekNumber = Math.ceil(
    differenceInMilliseconds / (7 * 24 * 60 * 60 * 1000),
  );
  return weekNumber;
};
