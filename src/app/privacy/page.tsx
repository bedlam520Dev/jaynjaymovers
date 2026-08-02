import { PrivacyContent } from '@/components/legal/LegalContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Jay N Jay Movers.',
};

export default function PrivacyPage() {
  return <PrivacyContent mode='page' />;
}
