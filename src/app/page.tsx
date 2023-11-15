import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession();

  return <div>{session?.user?.name}</div>;
}
