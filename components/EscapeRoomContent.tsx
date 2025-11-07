"use client";

import { useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function EscapeRoomContent() {
  useEffect(() => {
    document.cookie = "lastTab=escape-room; path=/";
  }, []);

  return (
    <main
      role="main"
      aria-labelledby="escape-room-heading"
      className="px-4 py-8 space-y-6"
    >
      {/* Breadcrumbs always top-left */}
      <div className="text-left">
        <Breadcrumbs />
      </div>

      <div className="flex flex-col items-center justify-center text-center min-h-[20vh] px-4 space-y-4">
        <h1 id="escape-room-heading" className="big-title">
          Escape Room Page
        </h1>
        <h2>This page is under construction.</h2>
        <p>Please check back later for updates.</p>
      </div>
    </main>
  );
}
