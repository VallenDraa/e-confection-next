import { SizeBody, SizeGETResponse } from '@/app/api/size/size-route.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ServerStateHookCallback } from './server-state-hooks.types';

type useSizeProps = ServerStateHookCallback;

export function useSize(props: useSizeProps) {
  const { onSuccess, onError } = props;

  const queryClient = useQueryClient();
  const queryResultBeforeComma = useQuery<SizeGETResponse>({
    queryKey: ['size', 'before-comma'],
    staleTime: Infinity,
    async queryFn() {
      try {
        const { data } = await axios.get(`/api/size?type=before-comma`);

        return data;
      } catch (error) {
        onError?.('query');

        return { data: [] };
      }
    },
  });

  const queryResultAfterComma = useQuery<SizeGETResponse>({
    queryKey: ['size', 'after-comma'],
    async queryFn() {
      try {
        const { data } = await axios.get(`/api/size?type=after-comma`);

        return data;
      } catch (error) {
        onError?.('query');

        return { data: [] };
      }
    },
  });

  const addSize = useMutation({
    mutationFn: async (newSize: SizeBody) => {
      await axios.post('/api/size', newSize);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['size', 'before-comma'] });
      queryClient.invalidateQueries({ queryKey: ['size', 'after-comma'] });
      onSuccess?.('add');
    },
    onError: () => onError?.('add'),
  });

  const deleteSize = useMutation({
    mutationFn: async (sizeId: string) => {
      await axios.delete(`/api/size/${sizeId}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['size', 'before-comma'] });
      queryClient.invalidateQueries({ queryKey: ['size', 'after-comma'] });
      onSuccess?.('delete');
    },
    onError: () => onError?.('delete'),
  });

  return { queryResultBeforeComma, queryResultAfterComma, addSize, deleteSize };
}
