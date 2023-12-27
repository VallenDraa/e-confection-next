import { SeriProduksiGETResponse } from '@/app/api/seri-produksi/seri-produksi.types';
import { NewSeriProduksi } from '@/schema/seri-produksi.schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type CallbackType = 'query' | 'add' | 'edit' | 'delete';

type useSeriProduksiProps = {
  page: number;
  onSuccess?: (type: CallbackType) => void;
  onError?: (type: CallbackType) => void;
};

export function useSeriProduksi(props: useSeriProduksiProps) {
  const { page, onSuccess, onError } = props;

  const queryClient = useQueryClient();
  const queryResult = useQuery<SeriProduksiGETResponse>({
    queryKey: ['seri-produksi', page],
    async queryFn() {
      try {
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

  return { queryResult, addSeriProduksi, editSeriProduksi, deleteSeriProduksi };
}
