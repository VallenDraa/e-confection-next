import { Metadata } from 'next';
import { SignInPanel } from '@/components/sign-in-page/sign-in-panel';

export const metadata: Metadata = { title: 'E-Confection | Sign In' };

export default function SignIn() {
  return <SignInPanel />;
}
