"use client";
import { AuthLayout } from "../../layouts/auth-layout";
import { SignUp } from "../../components/pages/auth-layout/sign-up";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}

