import { clientUnauthedRedirect } from '@/lib/auth/user-auth-checker';

export default async function BarangPage() {
  await clientUnauthedRedirect();

  return <div>Barang</div>;
}
