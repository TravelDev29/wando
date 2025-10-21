"use client";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SettingsLayout } from "../../layouts/settings-layout";
import { Notifications } from "../../components/pages/settings-layout/notifications";

export default function NotificationsPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Notifications />
      </SettingsLayout>
    </SidebarProvider>
  );
}

