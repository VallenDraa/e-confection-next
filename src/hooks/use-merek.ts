import { MerekBody, MerekGETResponse } from '@/app/api/merek/merek-route.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type CallbackType = 'query' | 'add' | 'edit' | 'delete';

type useMerekProps = {
  onSuccess?: (type: CallbackType) => void;
  onError?: (type: CallbackType) => void;
};

export default function useMerek(props: useMerekProps) {
  const { onSuccess, onError } = props;

  const queryClient = useQueryClient();
  const queryResult = useQuery<MerekGETResponse>({
    queryKey: ['merek'],
    async queryFn() {
      try {
        const { data } = await axios.get(`/api/merek`);

        return data;
      } catch (error) {
        onError?.('query');

        return { data: [] };
      }
    },
  });

  const addSize = useMutation({
    mutationKey: ['merek'],
    mutationFn: async (newMerek: MerekBody) => {
      await axios.post('/api/merek', newMerek);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['merek'] });
      onSuccess?.('add');
    },
    onError: () => onError?.('add'),
  });

  const deleteSize = useMutation({
    mutationFn: async (merekId: string) => {
      await axios.delete(`/api/merek/${merekId}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['merek'] });
      onSuccess?.('delete');
    },
    onError: () => onError?.('delete'),
  });

  return { queryResult, addSize, deleteSize };
}
