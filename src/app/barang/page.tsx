import { clientUnauthedRedirect } from '@/utils/auth/is-client-authed';

export default async function BarangPage() {
  await clientUnauthedRedirect();

  return <div>Barang</div>;
}
