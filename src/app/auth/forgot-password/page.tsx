import { AuthPageLayout } from '@/components/auth/auth-page-layout';
import { ForgotPasswordForm } from '@/components/forgot-password-form';

export default function Page() {
  return (
    <AuthPageLayout
      title='Forgot password'
      description='Enter your email and we will send you a reset link'
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
