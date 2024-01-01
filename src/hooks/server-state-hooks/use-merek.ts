import { MerekBody, MerekGETResponse } from '@/app/api/merek/merek-route.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ServerStateHookCallback } from './server-state-hooks.types';

type useMerekProps = ServerStateHookCallback;

export function useMerek(props: useMerekProps) {
  const { onSuccess, onError } = props;

  const queryClient = useQueryClient();
  const queryResult = useQuery<MerekGETResponse>({
    queryKey: ['merek'],
    staleTime: Infinity,
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

  const addMerek = useMutation({
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

  const deleteMerek = useMutation({
    mutationFn: async (merekId: string) => {
      await axios.delete(`/api/merek/${merekId}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['merek'] });
      onSuccess?.('delete');
    },
    onError: () => onError?.('delete'),
  });

  return { queryResult, addMerek, deleteMerek };
}
