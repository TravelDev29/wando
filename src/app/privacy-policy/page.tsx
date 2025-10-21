"use client";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SettingsLayout } from "../../layouts/settings-layout";
import { PrivacyPolicy } from "../../components/pages/settings-layout/privacy-policy";

export default function PrivacyPolicyPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <PrivacyPolicy />
      </SettingsLayout>
    </SidebarProvider>
  );
}

