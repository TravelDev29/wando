"use client";
import { AppLayout } from "../../layouts/app-layout";
import { ChatProvider } from "../../providers/chat-provider";
import { Saved } from "../../components/pages/app-layout/saved";
import { Banner } from "../../components/custom/banner";

export default function SavedPage() {
  return (
    <AppLayout>
      <Banner />
      <ChatProvider>
        <Saved />
      </ChatProvider>
    </AppLayout>
  );
}

