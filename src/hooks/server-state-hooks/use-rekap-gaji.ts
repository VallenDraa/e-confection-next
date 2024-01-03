import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ServerStateHookCallback } from './server-state-hooks.types';
import { RekapGajiGETPaginatedResponse } from '@/app/api/rekap-gaji/rekap-gaji-route.types';

type useRekapGajiProps = ServerStateHookCallback & {
  rekapGajiByKaryawan?: {
    initialPage: number;
    id: string;
  };
  rekapGajiByGrupWarna?: {
    id: string;
  };
};

export function useRekapGaji(props: useRekapGajiProps) {
  const { onError, onSuccess, rekapGajiByKaryawan, rekapGajiByGrupWarna } =
    props;

  const queryResultByKaryawan = useInfiniteQuery<RekapGajiGETPaginatedResponse>(
    {
      queryKey: ['rekap-gaji', 'infinite', rekapGajiByKaryawan],
      initialPageParam: () => rekapGajiByKaryawan?.initialPage || 1,
      getNextPageParam: prev => {
        return prev.metadata?.next === prev.metadata?.last
          ? undefined
          : prev.metadata?.next;
      },
      async queryFn({ pageParam }) {
        if (!rekapGajiByKaryawan) {
          return {
            data: [],
            metadata: { last: 0, current: 0, next: 0, prev: 0 },
          };
        }

        try {
          const { data } = await axios.get<RekapGajiGETPaginatedResponse>(
            `/api/rekap-gaji/by-karyawan/${rekapGajiByKaryawan.id}?page=${(
              pageParam as () => number
            )()}`,
          );

          onSuccess?.('query');
          return data;
        } catch (error) {
          onError?.('query');
          return {
            data: [],
            metadata: { last: 0, current: 0, next: 0, prev: 0 },
          };
        }
      },
    },
  );

  const queryResultByGrupWarna = useQuery({
    queryKey: ['rekap-gaji', 'non-infinite', rekapGajiByGrupWarna],
    async queryFn() {
      if (!rekapGajiByGrupWarna) {
        return { data: [] };
      }

      try {
        const { data } = await axios.get<RekapGajiGETPaginatedResponse>(
          `/api/rekap-gaji/by-grup-warna/${rekapGajiByGrupWarna.id}`,
        );

        onSuccess?.('query');
        return data;
      } catch (error) {
        onError?.('query');

        return {
          data: [],
          metadata: { last: 0, current: 0, next: 0, prev: 0 },
        };
      }
    },
  });

  return { queryResultByGrupWarna, queryResultByKaryawan };
}
