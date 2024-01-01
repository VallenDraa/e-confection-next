import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BajuGETResponse } from '@/app/api/baju/baju-route.types';
import { ServerStateHookCallback } from './server-state-hooks.types';
import { RequireAtLeastOne } from '@/types';

type UseBajuQueryKey = {
  seriProduksiId?: string;
  rekapGajiKaryawanId?: string;
  karyawanId?: string;
  sizeId?: string;
  grupWarnaBajuId?: string;
  merekId?: string;
};

type useBajuProps = ServerStateHookCallback & {
  queryKey: RequireAtLeastOne<UseBajuQueryKey>;
};

export default function useBaju(props: useBajuProps) {
  const { onSuccess, onError, queryKey } = props;

  const queryResult = useQuery<BajuGETResponse>({
    queryKey: ['baju', queryKey],
    async queryFn() {
      try {
        let apiUrl = `/api/baju`;
        let isFirstKey = true;

        for (const iterator in queryKey) {
          if (isFirstKey) {
            apiUrl = `${apiUrl}?${iterator}=${
              queryKey[iterator as keyof UseBajuQueryKey]
            }`;

            isFirstKey = false;
          } else {
            apiUrl = `${apiUrl}&${iterator}=${
              queryKey[iterator as keyof UseBajuQueryKey]
            }`;
          }
        }

        const { data } = await axios.get(apiUrl);

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
