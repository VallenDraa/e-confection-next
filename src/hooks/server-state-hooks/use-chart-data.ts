import { ChartDataGETResponse } from '@/app/api/chart/chart-produksi.types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ServerStateHookCallback } from './server-state-hooks.types';

export type StatsTimePeriod = 'Bulanan' | 'Mingguan' | 'Tahunan';

export type UseChartDataProps = ServerStateHookCallback & {
  timePeriod: StatsTimePeriod;
};

export function useChartData(props: UseChartDataProps) {
  const { timePeriod, onError, onSuccess } = props;

  const APITimePeriod = (() => {
    if (timePeriod === 'Tahunan') {
      return 'yearly';
    } else if (timePeriod === 'Mingguan') {
      return 'weekly';
    } else {
      return 'monthly';
    }
  })();

  const produksiQueryResult = useQuery<ChartDataGETResponse>({
    queryKey: ['chart', 'produksi', APITimePeriod],
    async queryFn() {
      try {
        const { data } = await axios.get<ChartDataGETResponse>(
          `/api/chart/produksi/${APITimePeriod}`,
        );

        onSuccess?.('query');

        return data;
      } catch (error) {
        onError?.('query');

        return { data: { labels: [], datasets: [] } };
      }
    },
  });

  const rekapGajiQueryResult = useQuery<ChartDataGETResponse>({
    queryKey: ['chart', 'rekap-gaji', APITimePeriod],
    async queryFn() {
      try {
        const { data } = await axios.get<ChartDataGETResponse>(
          `/api/chart/rekap-gaji/${APITimePeriod}`,
        );

        onSuccess?.('query');

        return data;
      } catch (error) {
        onError?.('query');

        return { data: { labels: [], datasets: [] } };
      }
    },
  });

  return { produksiQueryResult, rekapGajiQueryResult };
}
