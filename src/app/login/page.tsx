"use client";
import { AuthLayout } from "../../layouts/auth-layout";
import { Login } from "../../components/pages/auth-layout/login";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}

