import { ChartData } from '@/app/api/chart/chart-produksi.types';
import { getWeekYearKey } from '../formatter';

export const groupByWeek = <T extends { createdAt: Date }>(data: T[]) => {
  return data.reduce<Record<string, T[]>>((acc, item) => {
    const weekYearKey = getWeekYearKey(item.createdAt);

    if (!acc[weekYearKey]) {
      acc[weekYearKey] = [];
    }
    acc[weekYearKey].push(item);
    return acc;
  }, {});
};

export const groupByMonth = <T extends { createdAt: Date }>(data: T[]) => {
  return data.reduce<Record<string, T[]>>((acc, item) => {
    const monthYear = `${
      item.createdAt.getMonth() + 1
    }/${item.createdAt.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);

    return acc;
  }, {});
};

export const groupByYear = <T extends { createdAt: Date }>(data: T[]) => {
  return data.reduce<Record<string, T[]>>((acc, item) => {
    const year = item.createdAt.getFullYear().toString();

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(item);
    return acc;
  }, {});
};

export const formatChartData = <T extends { createdAt: Date; jumlah: number }>(
  label: string,
  groupedData: Record<string, T[]>,
) => {
  const datasets: ChartData['datasets'] = [
    {
      label,
      data: [],
      backgroundColor: `#2196f3`,
    },
  ];

  for (const monthYear in groupedData) {
    if (monthYear in groupedData) {
      const totalGaji = groupedData[monthYear].reduce(
        (sum, item) => sum + item.jumlah,
        0,
      );

      datasets[0].data.push(totalGaji);
    }
  }

  return { labels: Object.keys(groupedData), datasets };
};
