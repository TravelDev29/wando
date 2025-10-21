"use client";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SettingsLayout } from "../../layouts/settings-layout";
import { Billing } from "../../components/pages/settings-layout/billing";

export default function BillingPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Billing />
      </SettingsLayout>
    </SidebarProvider>
  );
}

