"use client";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SettingsLayout } from "../../layouts/settings-layout";
import { Usage } from "../../components/pages/settings-layout/usage";

export default function UsagePage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Usage />
      </SettingsLayout>
    </SidebarProvider>
  );
}

