"use client";
import { AppLayout } from "../../layouts/app-layout";
import { ChatProvider } from "../../providers/chat-provider";
import Explore from "../../components/pages/app-layout/explore";
import { Banner } from "../../components/custom/banner";

export default function ExplorePage() {
  return (
    <AppLayout>
      <Banner />
      <ChatProvider>
        <Explore />
      </ChatProvider>
    </AppLayout>
  );
}
