"use client";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SettingsLayout } from "../../layouts/settings-layout";
import { Updates } from "../../components/pages/settings-layout/updates";

export default function UpdatesPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Updates />
      </SettingsLayout>
    </SidebarProvider>
  );
}

