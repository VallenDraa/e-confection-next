import {
  KaryawanGETResponse,
  KaryawanPUTBody,
} from '@/app/api/karyawan/karyawan-route.types';
import { KaryawanPreviewGETResponse } from '@/app/api/karyawan/preview/karyawan-preview-route.types';
import { Karyawan } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ServerStateHookCallback } from './server-state-hooks.types';

type useKaryawanProps = ServerStateHookCallback & {
  karyawanPage: number;
};

export default function useKaryawan(props: useKaryawanProps) {
  const { karyawanPage, onSuccess, onError } = props;

  const queryClient = useQueryClient();

  const queryResult = useQuery<KaryawanGETResponse>({
    queryKey: ['karyawan', karyawanPage],
    async queryFn() {
      try {
        const { data } = await axios.get<KaryawanGETResponse>(
          `/api/karyawan?page=${karyawanPage}`,
        );

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

  const previewQueryResult = useQuery<KaryawanPreviewGETResponse>({
    queryKey: ['karyawan', 'preview'],
    staleTime: Infinity,
    async queryFn() {
      try {
        const { data } = await axios.get<KaryawanGETResponse>(
          '/api/karyawan/preview',
        );

        return data;
      } catch (error) {
        onError?.('query');

        return { data: [] };
      }
    },
  });

  const addKaryawan = useMutation({
    mutationKey: ['karyawan', karyawanPage],
    mutationFn: async (newKaryawan: Pick<Karyawan, 'nama' | 'telepon'>) => {
      await axios.post('/api/karyawan', newKaryawan);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['karyawan', karyawanPage] });
      queryClient.invalidateQueries({ queryKey: ['karyawan', 'preview'] });
      onSuccess?.('add');
    },
    onError: () => onError?.('add'),
  });

  const editKaryawan = useMutation({
    mutationFn: async (newKaryawan: KaryawanPUTBody) => {
      await axios.put('/api/karyawan', newKaryawan);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['karyawan', karyawanPage] });
      queryClient.invalidateQueries({ queryKey: ['karyawan', 'preview'] });
      onSuccess?.('edit');
    },
    onError: () => onError?.('edit'),
  });

  const deleteKaryawan = useMutation({
    mutationKey: ['karyawan', karyawanPage],
    mutationFn: async (karyawanIds: string[]) => {
      await axios.delete('/api/karyawan', { data: { ids: karyawanIds } });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['karyawan', karyawanPage] });
      queryClient.invalidateQueries({ queryKey: ['karyawan', 'preview'] });

      onSuccess?.('delete');
    },
    onError: () => onError?.('delete'),
  });

  return {
    queryResult,
    previewQueryResult,
    addKaryawan,
    editKaryawan,
    deleteKaryawan,
  };
}
