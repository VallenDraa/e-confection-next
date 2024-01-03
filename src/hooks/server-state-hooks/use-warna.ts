import { WarnaBody, WarnaGETResponse } from '@/app/api/warna/warna-route.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ServerStateHookCallback } from './server-state-hooks.types';
import axios from 'axios';

type useWarnaProps = ServerStateHookCallback;

export function useWarna(props: useWarnaProps) {
  const { onSuccess, onError } = props;

  const queryClient = useQueryClient();
  const queryResult = useQuery<WarnaGETResponse>({
    queryKey: ['warna'],
    staleTime: Infinity,
    async queryFn() {
      try {
        const { data } = await axios.get(`/api/warna`);

        return data;
      } catch (error) {
        onError?.('query');

        return { data: [] };
      }
    },
  });

  const addWarna = useMutation({
    mutationKey: ['warna'],
    mutationFn: async (newWarna: WarnaBody) => {
      await axios.post('/api/warna', newWarna);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['warna'] });
      onSuccess?.('add');
    },
    onError: () => onError?.('add'),
  });

  const deleteWarna = useMutation({
    mutationFn: async (warnaId: string) => {
      await axios.delete(`/api/warna/${warnaId}`);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['warna'] });
      onSuccess?.('delete');
    },
    onError: () => onError?.('delete'),
  });

  return { queryResult, addWarna, deleteWarna };
}
