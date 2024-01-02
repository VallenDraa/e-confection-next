import { KaryawanPagePanel } from '@/components/karyawan-page/karyawan-page-panel';
import { clientUnauthedRedirect } from '@/lib/auth/user-auth-checker';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'E-Confection | Karyawan' };

export default async function KaryawanPage() {
  await clientUnauthedRedirect();

  return <KaryawanPagePanel />;
}
