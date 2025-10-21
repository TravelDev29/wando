"use client";
import { AppLayout } from "../../layouts/app-layout";
import { ChatProvider } from "../../providers/chat-provider";
import { MyTrips } from "../../components/pages/app-layout/my-trips";
import { Banner } from "../../components/custom/banner";

export default function MyTripsPage() {
  return (
    <AppLayout>
      <Banner />
      <ChatProvider>
        <MyTrips />
      </ChatProvider>
    </AppLayout>
  );
}

