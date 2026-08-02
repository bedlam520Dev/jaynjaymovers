import { DataPolicyContent } from '@/components/legal/LegalContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Handling Policy',
  description: 'Data handling policy for Jay N Jay Movers.',
};

export default function DataPolicyPage() {
  return <DataPolicyContent mode='page' />;
}
