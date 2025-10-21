'use client';
import { SidebarProvider } from '../../components/ui/sidebar';
import { SettingsLayout } from '../../layouts/settings-layout';
import { History } from '../../components/pages/settings-layout/history';

export default function HistoryPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <History />
      </SettingsLayout>
    </SidebarProvider>
  );
}
