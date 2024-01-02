import { BajuPagePanel } from '@/components/baju-page/baju-page-panel';
import { clientUnauthedRedirect } from '@/lib/auth/user-auth-checker';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'E-Confection | Baju' };

export default async function BajuPage() {
  await clientUnauthedRedirect();

  return <BajuPagePanel />;
}
