"use client";

import { useEffect, useState } from "react";
import CourtRoomContent from "@/components/CourtRoomContent";

export default function CourtRoom() {
  const [bgImage, setBgImage] = useState("/CourtRoomWorkDeskLight.png");

  const handleCourtTriggered = () => {
    // Show penalty background for 10 seconds
    setBgImage("/CourtRoomStageLight.png");

    setTimeout(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setBgImage(
        isDark ? "/CourtRoomWorkDeskDark.png" : "/CourtRoomWorkDeskLight.png"
      );
    }, 10000);
  };

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
      attributeFilter: ["class"],
    });

    updateBackground();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <CourtRoomContent onCourtTriggered={handleCourtTriggered} />
    </div>
  );
}
