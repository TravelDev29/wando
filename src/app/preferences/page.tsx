"use client";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SettingsLayout } from "../../layouts/settings-layout";
import { Preferences } from "../../components/pages/settings-layout/preferences";

export default function PreferencesPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Preferences />
      </SettingsLayout>
    </SidebarProvider>
  );
}

