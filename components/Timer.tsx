"use client";

import { useEffect, useState, useCallback } from "react";

interface TimerProps {
  onTimerEnd?: () => void;
  onTick?: (elapsedMs: number) => void;
}

// Helper to format time as MM:SS (Padded seconds)
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export default function Timer({ onTimerEnd }: TimerProps) {
  // --- State and Handlers (Unchanged) ---
  const [minutesInput, setMinutesInput] = useState(5);
  const [secondsInput, setSecondsInput] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(true);

  const calculateTotalSeconds = useCallback(() => {
    return minutesInput * 60 + secondsInput;
  }, [minutesInput, secondsInput]);

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMinutesInput(Math.min(99, Math.max(0, isNaN(value) ? 0 : value)));
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSecondsInput(Math.min(59, Math.max(0, isNaN(value) ? 0 : value)));
  };

  const handleStart = () => {
    const totalSeconds = calculateTotalSeconds();
    if (totalSeconds > 0) {
      setTimeRemaining(totalSeconds);
      setIsRunning(true);
      setIsSetupMode(false);
    }
  };

  const handlePause = () => setIsRunning(false);

  const handleStopAndSetup = () => {
    setIsRunning(false);
    setTimeRemaining(calculateTotalSeconds());
    setIsSetupMode(true);
  };

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) {
      if (timeRemaining === 0 && !isSetupMode) {
        setIsRunning(false);
        onTimerEnd?.();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimerEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, isSetupMode, onTimerEnd]);

  useEffect(() => {
    if (isSetupMode) {
      setTimeRemaining(calculateTotalSeconds());
    }
  }, [minutesInput, secondsInput, isSetupMode, calculateTotalSeconds]);

  return (
    // FIX: Reduced horizontal padding (px-3 instead of p-4)
    <div className="px-3 py-4 bg-gray-800 text-white rounded-lg shadow-xl">
      <h3 className="text-lg font-bold mb-3">Timer</h3>

      {isSetupMode ? (
        // --- Setup Mode: Input Fields ---
        // FIX: Removed justify-center to align items to the start/left of the div
        <div className="flex space-x-2 items-center">
          <input
            type="number"
            value={String(minutesInput).padStart(2, "0")}
            onChange={handleMinutesChange}
            placeholder="MM"
            className="w-14 p-1 text-center text-xl bg-gray-700 rounded text-white border-none focus:ring-blue-500 focus:border-blue-500" // Reduced width/padding
          />
          <span className="text-2xl">:</span>
          <input
            type="number"
            value={String(secondsInput).padStart(2, "0")}
            onChange={handleSecondsChange}
            placeholder="SS"
            className="w-14 p-1 text-center text-xl bg-gray-700 rounded text-white border-none focus:ring-blue-500 focus:border-blue-500" // Reduced width/padding
          />
          <button
            onClick={handleStart}
            className="ml-4 px-3 py-1 bg-green-500 rounded hover:bg-green-600 font-semibold text-sm" // Reduced button size
          >
            Start
          </button>
        </div>
      ) : (
        // --- Running/Paused Mode: Display and Controls ---
        <>
          <div className="text-5xl font-mono text-center mb-3">
            {formatTime(timeRemaining)}
          </div>

          {/* FIX: Removed justify-center to align buttons to the left */}
          <div className="flex space-x-3">
            {isRunning ? (
              <button
                onClick={handlePause}
                className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 font-semibold"
              >
                Pause
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 font-semibold"
              >
                Resume
              </button>
            )}

            <button
              onClick={handleStopAndSetup}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 font-semibold"
            >
              Stop / Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}
