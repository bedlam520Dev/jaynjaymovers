import { AuthPageLayout } from '@/components/auth/auth-page-layout';
import { UpdatePasswordForm } from '@/components/update-password-form';

export default function Page() {
  return (
    <AuthPageLayout
      title='Update password'
      description='Enter your new password below'
    >
      <UpdatePasswordForm />
    </AuthPageLayout>
  );
}
