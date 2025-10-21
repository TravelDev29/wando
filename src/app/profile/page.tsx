'use client';
import { SidebarProvider } from '../../components/ui/sidebar';
import { SettingsLayout } from '../../layouts/settings-layout';
import { Profile } from '../../components/pages/settings-layout/profile';

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <SettingsLayout>
        <Profile />
      </SettingsLayout>
    </SidebarProvider>
  );
}
