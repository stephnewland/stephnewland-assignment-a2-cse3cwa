import { useEffect, useState } from "react";
import MessageQueue from "./MessageQueue";
import Timer from "./Timer";

export default function CourtRoomContent({
  onCourtTriggered,
  onFineTriggered,
  onFineClosed,
}: {
  onCourtTriggered?: () => void;
  onFineTriggered?: () => void;
  onFineClosed?: () => void;
}) {
  const [stage, setStage] = useState(1);
  const [backgroundImage, setBackgroundImage] = useState(
    "/CourtRoomWorkDeskLight.png"
  );

  const handleCourtTriggeredLocal = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setBackgroundImage(
      isDark ? "/CourtRoomStageDark.png" : "/CourtRoomStageLight.png"
    );

    if (onCourtTriggered) onCourtTriggered();
  };

  const handleFineClosed = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setBackgroundImage(
      isDark ? "/CourtRoomWorkDeskDark.png" : "/CourtRoomWorkDeskLight.png"
    );
  };

  useEffect(() => {
    const updateBackground = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setBackgroundImage(
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
    <main
      role="main"
      aria-labelledby="court-room-heading"
      className="w-full max-w-4xl min-h-screen px-4 py-8 space-y-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      <div className="flex flex-col items-center justify-center text-center min-h-[20vh] px-4 space-y-4">
        <h1 id="court-room-heading" className="big-title">
          Welcome to the Court Room
        </h1>

        <Timer
          onTimerEnd={() => {}}
          onTick={(elapsedMs) => {
            if (stage === 1 && elapsedMs >= 20000) {
              setStage(2);
            }
          }}
        />

        <MessageQueue
          onCourtTriggered={handleCourtTriggeredLocal}
          onFineTriggered={() => setStage(3)}
          onFineClosed={handleFineClosed}
        />
      </div>

      {/* ✅ Stage Buttons */}
      <div className="flex gap-4 justify-center mt-8">
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
    </main>
  );
}
