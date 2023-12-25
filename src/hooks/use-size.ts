import { SizeBody, SizeGETResponse } from '@/app/api/size/size-route.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type CallbackType = 'query' | 'add' | 'edit' | 'delete';

type useSizeProps = {
  onSuccess?: (type: CallbackType) => void;
  onError?: (type: CallbackType) => void;
};

export default function useSize(props: useSizeProps) {
  const { onSuccess, onError } = props;

  const queryClient = useQueryClient();
  const queryResult = useQuery<SizeGETResponse>({
    queryKey: ['size'],
    async queryFn() {
      try {
        const { data } = await axios.get(`/api/size`);

        return data;
      } catch (error) {
        onError?.('query');

        return { data: [] };
      }
    },
  });

  const addSize = useMutation({
    mutationKey: ['size'],
    mutationFn: async (newSize: SizeBody) => {
      await axios.post('/api/size', newSize);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['size'] });
      onSuccess?.('add');
    },
    onError: () => onError?.('add'),
  });

  const deleteSize = useMutation({
    mutationFn: async (sizeId: string) => {
      await axios.delete(`/api/size/${sizeId}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['size'] });
      onSuccess?.('delete');
    },
    onError: () => onError?.('delete'),
  });

  return { queryResult, addSize, deleteSize };
}
