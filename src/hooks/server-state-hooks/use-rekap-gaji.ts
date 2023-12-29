import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ServerStateHooksCallbackType } from './server-state-hooks.types';
import { RekapGajiGETResponse } from '@/app/api/rekap-gaji/rekap-gaji-route.types';

type useRekapGajiProps = {
  karyawanId: string;
  onSuccess?: (type: ServerStateHooksCallbackType) => void;
  onError?: (type: ServerStateHooksCallbackType) => void;
};

export function useRekapGaji(props: useRekapGajiProps) {
  const { karyawanId, onError, onSuccess } = props;
  const rekapGajiQueryResult = useQuery({
    queryKey: ['rekap-gaji', karyawanId],
    async queryFn() {
      try {
        const { data } = await axios.get<RekapGajiGETResponse>(
          `/api/karyawan?page=${karyawanId}`,
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

  return { rekapGajiQueryResult };
}
