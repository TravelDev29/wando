"use client";
import { SidebarProvider } from "../../components/ui/sidebar";
import { SettingsLayout } from "../../layouts/settings-layout";
import { AffiliateProgram } from "../../components/pages/settings-layout/affiliate-program";

export default function AffiliateProgramPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <AffiliateProgram />
      </SettingsLayout>
    </SidebarProvider>
  );
}

