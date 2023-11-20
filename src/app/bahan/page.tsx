import { clientUnauthedRedirect } from '@/lib/auth/user-auth-checker';

export default async function BahanPage() {
  await clientUnauthedRedirect();

  return <div>BahanPage</div>;
}
