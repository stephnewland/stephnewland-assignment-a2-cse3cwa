"use client";

import dynamic from "next/dynamic";

const CourtRoomContent = dynamic(
  () => import("@/components/CourtRoomContent"),
  {
    ssr: false,
  }
);

export default function CourtRoomPage() {
  return <CourtRoomContent />;
}
