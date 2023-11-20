import { clientUnauthedRedirect } from '@/lib/auth/user-auth-checker';

export default async function KaryawanPage() {
  await clientUnauthedRedirect();

  return <div>KaryawanPage</div>;
}
