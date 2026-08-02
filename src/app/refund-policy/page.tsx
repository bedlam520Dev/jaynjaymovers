import { RefundContent } from '@/components/legal/LegalContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy for Jay N Jay Movers.',
};

export default function RefundPolicyPage() {
  return <RefundContent mode='page' />;
}
