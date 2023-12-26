import { BajuGETResponse } from '@/app/api/baju/baju-route.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type CallbackType = 'query' | 'add' | 'edit' | 'delete';

type useBajuProps = {
  type: 'baju';
  page: number;
  onSuccess?: (type: CallbackType) => void;
  onError?: (type: CallbackType) => void;
};

export default function useBaju(props: useBajuProps) {
  const { page, onSuccess, onError } = props;

  const queryClient = useQueryClient();
  const queryResult = useQuery<BajuGETResponse>({
    queryKey: ['baju', page],
    async queryFn() {
      try {
        const { data } = await axios.get(`/api/baju?page=${page}`);

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

  const addBaju = useMutation({
    mutationKey: ['baju', page],
    mutationFn: async (newBaju: any) => {
      await axios.post('/api/baju', newBaju);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['baju', page] });
      onSuccess?.('add');
    },
    onError: () => onError?.('add'),
  });

  const editBaju = useMutation({
    mutationFn: async newBaju => {
      await axios.put('/api/baju', newBaju);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['baju', page] });
      onSuccess?.('edit');
    },
    onError: () => onError?.('edit'),
  });

  const deleteBaju = useMutation({
    mutationKey: ['baju', page],
    mutationFn: async (bajuIds: string[]) => {
      await axios.delete('/api/baju', { data: { ids: bajuIds } });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['baju', page] });
      onSuccess?.('delete');
    },
    onError: () => onError?.('delete'),
  });

  return { queryResult, addBaju, editBaju, deleteBaju };
}
