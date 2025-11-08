"use client";

import { useEffect, useState } from "react";
import MessageQueue from "./MessageQueue";
import Timer from "./Timer";

interface CourtRoomContentProps {
  onCourtTriggered?: () => void;
}

export default function CourtRoomContent({
  onCourtTriggered,
}: CourtRoomContentProps) {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    document.cookie = "lastTab=court-room; path=/";
  }, []);

  return (
    <main
      role="main"
      aria-labelledby="court-room-heading"
      className="px-4 py-8 space-y-6 w-full max-w-4xl min-h-screen"
    >
      <div className="flex flex-col items-center justify-center text-center min-h-[20vh] px-4 space-y-4">
        <h1 id="court-room-heading" className="big-title">
          Court Room Simulation
        </h1>
        <Timer onTimerEnd={() => {}} />
        <p className="text-lg">
          Current Stage: <strong>{stage}</strong>
        </p>

        {stage === 1 && <p>🛠️ Stage 1: Debug the code below...</p>}
        {stage === 2 && (
          <p>🛠️ Stage 2: Continue debugging and watch for messages...</p>
        )}
        {stage === 3 && (
          <p>🔐 Stage 3: Fix accessibility and security issues...</p>
        )}

        <div className="w-full mt-4">
          <MessageQueue onCourtTriggered={onCourtTriggered} />
        </div>

        <div className="flex gap-4 mt-4">
          {stage > 1 && (
            <button
              onClick={() => setStage((prev) => Math.max(prev - 1, 1))}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
            >
              Previous Stage
            </button>
          )}
          {stage < 3 && (
            <button
              onClick={() => setStage((prev) => Math.min(prev + 1, 3))}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Next Stage
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
