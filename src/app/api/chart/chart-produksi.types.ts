import { GETResponse } from '../responses.types';

export type ChartDataItem = {
  id: string;
  jumlah: number;
  createdAt: Date;
};

export type ChartData = {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
  }>;
};

export type ChartDataGETResponse = GETResponse<ChartData>;
