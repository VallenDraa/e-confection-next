import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ServerStateHookCallback } from './server-state-hooks.types';
import { BajuGETResponse } from '@/app/api/baju/baju-route.types';

type useGrupWarnaProps = ServerStateHookCallback & {
  seriProduksiId: string;
};

export default function useGrupWarna(props: useGrupWarnaProps) {
  const { onSuccess, onError, seriProduksiId } = props;

  const queryResult = useQuery<BajuGETResponse>({
    queryKey: ['baju', seriProduksiId],
    async queryFn() {
      try {
        const { data } = await axios.get(
          `/api/grup-warna?seriProduksiId=${seriProduksiId}`,
        );

        onSuccess?.('query');

        return data;
      } catch (error) {
        onError?.('query');

        return { data: [] };
      }
    },
  });

  return { queryResult };
}
