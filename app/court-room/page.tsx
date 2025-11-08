"use client";

import { useEffect, useState } from "react";
import CourtRoomContent from "@/components/CourtRoomContent";

export default function CourtRoom() {
  // Current background image
  const [bgImage, setBgImage] = useState("/CourtRoomWorkDeskLight.png");

  // Callback for when a fine is issued
  const handleCourtTriggered = () => {
    const isDark = document.documentElement.classList.contains("dark");
    // Step 1: Set the fine/court background
    setBgImage(isDark ? "/CourtRoomStageDark.png" : "/CourtRoomStageLight.png");

    // Step 2: Revert to normal background after 5 seconds
    setTimeout(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setBgImage(
        isDark ? "/CourtRoomWorkDeskDark.png" : "/CourtRoomWorkDeskLight.png"
      );
    }, 10000);
  };

  // Detect dark/light mode and update background accordingly
  useEffect(() => {
    const updateBackground = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setBgImage(
        isDark ? "/CourtRoomWorkDeskDark.png" : "/CourtRoomWorkDeskLight.png"
      );
    };

    const observer = new MutationObserver(updateBackground);
    observer.observe(document.documentElement, {
      attributes: true,
      //wtach for dark mode class
      attributeFilter: ["class"],
    });

    // initial check
    updateBackground();
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen flex-grow overflow-hidden">
      {/* Background layer */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-all duration-700"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Content layer */}
      <div className="relative min-h-screen w-full bg-white/60 dark:bg-black/55 flex flex-col items-center justify-center transition-colors duration-300">
        <CourtRoomContent onCourtTriggered={handleCourtTriggered} />
      </div>
    </main>
  );
}
