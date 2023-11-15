import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const clientUnauthedRedirect = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }
};
