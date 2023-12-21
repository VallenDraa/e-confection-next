import { Header } from '@/components/ui/header';
import { authOptions } from '@/lib/auth';
import { Stack } from '@mui/material';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/sign-in');
  }

  return (
    <Stack>
      <Header>
        <h1>Home</h1>
      </Header>
    </Stack>
  );
}
