import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useCheckClientAuthed = () => {
  const { status } = useSession();
  const { push } = useRouter();

  if (status === 'unauthenticated') {
    push('/login');
  }
};
