import { KaryawanPagePanel } from '@/components/karyawan-page/karyawan-page-panel';
import { clientUnauthedRedirect } from '@/lib/auth/user-auth-checker';

export default async function KaryawanPage() {
  await clientUnauthedRedirect();

  return <KaryawanPagePanel />;
}
