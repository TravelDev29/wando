"use client";
import { AppLayout } from "../layouts/app-layout";
import { ChatProvider } from "../providers/chat-provider";
import { Home } from "../components/pages/app-layout/home";
import { Banner } from "../components/custom/banner";

export default function Page() {
  return (
    <AppLayout>
      <Banner />
      <ChatProvider>
        <Home />
      </ChatProvider>
    </AppLayout>
  );
}
