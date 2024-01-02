import { HomePagePanel } from '@/components/home-page-panel';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/sign-in');
  }

  return <HomePagePanel />;
}
