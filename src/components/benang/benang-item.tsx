import { Benang } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import * as React from 'react';

export type BenangItemProps = {
  benang: Benang;
};

export const BenangItem = (props: BenangItemProps) => {
  const { benang } = props;

  const queryClient = useQueryClient();
  const benangItemQuery = useQuery<Benang>({
    queryKey: ['benang', benang.id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/api/benang/${benang.id}`,
      );

      return data;
    },
    initialData: benang,
  });

  const [color, setColor] = React.useState(benangItemQuery.data!.color);
  const [quantity, setQuantity] = React.useState(
    benangItemQuery.data!.quantity,
  );

  const editBenangMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.put(`http://localhost:3000/api/benang/${id}`, {
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

  const deleteBenangMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/api/benang/${id}`);
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

      <button onClick={() => editBenangMutation.mutate(benang.id)}>Edit</button>
      <button onClick={() => deleteBenangMutation.mutate(benang.id)}>
        Delete
      </button>
    </div>
  );
};
