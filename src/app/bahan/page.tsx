'use client';

import { useCheckClientAuthed } from '@/hooks/use-check-client-authed';
import { Benang } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import axios from 'axios';
import { BenangItem } from '@/components/benang/benang-item';

export default function BahanPage() {
  useCheckClientAuthed();

  const [color, setColor] = React.useState('');
  const [quantity, setQuantity] = React.useState(0);

  const queryClient = useQueryClient();

  const benangQuery = useQuery<{
    benang: Benang[];
    meta: { currentPage: number; totalPages: number };
  }>({
    queryKey: ['benang'],
    queryFn: async () => {
      const { data } = await axios.get(
        'http://localhost:3000/api/benang?page=1',
      );

      return data;
    },
  });

  const addBenangMutation = useMutation({
    mutationFn: async ({
      color,
      quantity,
    }: {
      color: string;
      quantity: number;
    }) => {
      await axios.post('http://localhost:3000/api/benang', {
        color,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: true,
        queryKey: ['benang'],
      });
    },
  });

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();

          addBenangMutation.mutate({ color, quantity });
        }}
      >
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.valueAsNumber)}
        />

        <input
          type="text"
          value={color}
          onChange={e => setColor(e.target.value)}
        />

        <button>Submit</button>
      </form>

      {benangQuery.data?.benang.map(benang => {
        return <BenangItem key={benang.id} benang={benang} />;
      })}
    </div>
  );
}
