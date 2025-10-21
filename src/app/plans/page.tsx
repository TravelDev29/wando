'use client';
import { SidebarProvider } from '../../components/ui/sidebar';
import { SettingsLayout } from '../../layouts/settings-layout';
import { Plans } from '../../components/pages/settings-layout/plans';

export default function PlansPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Plans />
      </SettingsLayout>
    </SidebarProvider>
  );
}
