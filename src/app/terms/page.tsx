import { TermsContent } from '@/components/legal/LegalContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Jay N Jay Movers.',
};

export default function TermsPage() {
  return <TermsContent mode='page' />;
}
