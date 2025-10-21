'use client';
import { AuthLayout } from '../../layouts/auth-layout';
import { PasswordReset } from '../../components/pages/auth-layout/password-reset';

export default function PasswordResetPage() {
  return (
    <AuthLayout>
      <PasswordReset />
    </AuthLayout>
  );
}
