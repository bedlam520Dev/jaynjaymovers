import { AuthPageLayout } from '@/components/auth/auth-page-layout';
import { LoginForm } from '@/components/login-form';

export default function Page() {
  return (
    <AuthPageLayout
      title='Login'
      description='Enter your email below to login to your account'
    >
      <LoginForm />
    </AuthPageLayout>
  );
}
