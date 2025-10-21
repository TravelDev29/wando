'use client';
import { AppLayout } from '../layouts/app-layout';
import { ChatProvider } from '../providers/chat-provider';
import { NotFound } from '../components/pages/app-layout/not-found';
import { Banner } from '../components/custom/banner';

export default function NotFoundPage() {
  return (
    <AppLayout>
      <Banner />
      <ChatProvider>
        <NotFound />
      </ChatProvider>
    </AppLayout>
  );
}
