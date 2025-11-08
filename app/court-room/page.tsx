"use client";

import { useEffect, useState } from "react";
import CourtRoomContent from "@/components/CourtRoomContent";

export default function CourtRoom() {
  // Track if fine stage is active (overlay stays until fine dismissed)
  const [isFineActive, setIsFineActive] = useState(false);

  // Background images for desk and fine stage
  const [deskBg, setDeskBg] = useState("/CourtRoomWorkDeskLight.png");
  const [fineBg, setFineBg] = useState("/CourtRoomStageLight.png");

  // Callback for when a fine is issued
  const handleCourtTriggered = () => {
    setIsFineActive(true); // overlay appears
  };

  // Detect dark/light mode and update background images accordingly
  useEffect(() => {
    const updateBackground = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setDeskBg(
        isDark ? "/CourtRoomWorkDeskDark.png" : "/CourtRoomWorkDeskLight.png"
      );
      setFineBg(
        isDark ? "/CourtRoomStageDark.png" : "/CourtRoomStageLight.png"
      );
    };

    const observer = new MutationObserver(updateBackground);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"], // watch for dark mode toggle
    });

    // Initial update
    updateBackground();

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen flex-grow overflow-hidden">
      {/* Desk Background layer */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-all duration-700"
        style={{ backgroundImage: `url(${deskBg})` }}
      />

      {/* Fine Background overlay */}
      <div
        className={`absolute inset-0 bg-center bg-no-repeat bg-cover transition-opacity duration-700 pointer-events-none ${
          isFineActive ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url(${fineBg})` }}
      />

      {/* Red tint overlay during fine stage */}
      <div
        className={`absolute inset-0 bg-red-500 transition-opacity duration-700 pointer-events-none ${
          isFineActive ? "opacity-20" : "opacity-0"
        }`}
      />

      {/* Content overlay */}
      <div className="relative min-h-screen w-full bg-white/60 dark:bg-black/55 flex flex-col items-center justify-center transition-colors duration-300">
        <CourtRoomContent
          onCourtTriggered={handleCourtTriggered}
          onFineClosed={() => setIsFineActive(false)} // overlay stays until FineAlert dismissed
        />
      </div>
    </main>
  );
}
