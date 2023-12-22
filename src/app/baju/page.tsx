import { BajuPagePanel } from '@/components/baju-page/baju-page-panel';
import { clientUnauthedRedirect } from '@/lib/auth/user-auth-checker';

export default async function BajuPage() {
  await clientUnauthedRedirect();

  return <BajuPagePanel />;
}
