import {
  IndividualSeriProduksiGETResponse,
  SeriProduksiGETResponse,
} from '@/app/api/seri-produksi/seri-produksi-route.types';
import { NewSeriProduksi } from '@/schema/seri-produksi.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ServerStateHookCallback } from './server-state-hooks.types';

/**
 * When `page` argument is present, it means that it returns paginated result
 * meanwhile if `seriProduksiId` argument is filled it returns a one single result.
 */
type useSeriProduksiProps = ServerStateHookCallback & {
  page?: number;
  seriProduksiId?: string;
};

export function useSeriProduksi(props: useSeriProduksiProps) {
  const { page, seriProduksiId, onSuccess, onError } = props;

  const queryClient = useQueryClient();
  const queryResult = useQuery<SeriProduksiGETResponse>({
    queryKey: ['seri-produksi', page],
    async queryFn() {
      try {
        if (!page) {
          return {
            data: [],
            metadata: { last: 0, current: 0, next: 0, prev: 0 },
          };
        }

        const { data } = await axios.get(`/api/seri-produksi?page=${page}`);

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

  const individualQueryResult = useQuery<IndividualSeriProduksiGETResponse>({
    queryKey: ['seri-produksi', seriProduksiId],
    async queryFn() {
      try {
        if (!seriProduksiId) {
          return null;
        }

        const { data } = await axios.get(
          `/api/seri-produksi/${seriProduksiId}`,
        );

        return data;
      } catch (error) {
        onError?.('query');

        return null;
      }
    },
  });

  const addSeriProduksi = useMutation({
    mutationKey: ['seri-produksi', page],
    mutationFn: async (newSeriProduksi: NewSeriProduksi) => {
      await axios.post('/api/seri-produksi', newSeriProduksi);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['seri-produksi', page] });
      onSuccess?.('add');
    },
    onError: () => onError?.('add'),
  });

  const editSeriProduksi = useMutation({
    mutationFn: async newSeriProduksi => {
      await axios.put('/api/seri-produksi', newSeriProduksi);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['seri-produksi', page] });
      onSuccess?.('edit');
    },
    onError: () => onError?.('edit'),
  });

  const deleteSeriProduksi = useMutation({
    mutationKey: ['seri-produksi', page],
    mutationFn: async (seriProduksiIds: string[]) => {
      await axios.delete('/api/seri-produksi', {
        data: { ids: seriProduksiIds },
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['seri-produksi', page] });
      onSuccess?.('delete');
    },
    onError: () => onError?.('delete'),
  });

  return {
    individualQueryResult,
    queryResult,
    addSeriProduksi,
    editSeriProduksi,
    deleteSeriProduksi,
  };
}
