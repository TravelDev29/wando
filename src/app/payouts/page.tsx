"use client";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SettingsLayout } from "../../layouts/settings-layout";
import { Payouts } from "../../components/pages/settings-layout/payouts";

export default function PayoutsPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Payouts />
      </SettingsLayout>
    </SidebarProvider>
  );
}

