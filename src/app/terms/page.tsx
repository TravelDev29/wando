'use client';
import { SidebarProvider } from '../../components/ui/sidebar';
import { SettingsLayout } from '../../layouts/settings-layout';
import { Terms } from '../../components/pages/settings-layout/terms';

export default function TermsPage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Terms />
      </SettingsLayout>
    </SidebarProvider>
  );
}
