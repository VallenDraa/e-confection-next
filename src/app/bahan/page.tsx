import { clientUnauthedRedirect } from '@/lib/auth/is-client-authed';

export default async function BahanPage() {
  await clientUnauthedRedirect();

  return <div>BahanPage</div>;
}
