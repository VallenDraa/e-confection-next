import { clientUnauthedRedirect } from '@/utils/auth/is-client-authed';

export default async function KaryawanPage() {
  await clientUnauthedRedirect();

  return <div>KaryawanPage</div>;
}
