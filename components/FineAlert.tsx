"use client";

import React, { useEffect, useState } from "react";

export interface FineAlertProps {
  message: string;
  law?: string;
  onClose: () => void;
  type?: "legal" | "distraction";
  subtype?: "family" | "boss" | "agile";
  escalated?: boolean;
  isUrgent?: boolean;
  role?: string;
}

// Function to determine the icon based on the message details
const getMessageIcon = (props: FineAlertProps) => {
  if (props.type === "legal") {
    if (props.escalated) return "🚨"; // Final fine (Red)
    if (props.isUrgent) return "⚡"; // Urgent legal (Orange)
  }
  if (props.subtype === "family") return "💬"; // Blue
  if (props.subtype === "boss") return "📝"; // Yellow
  if (props.subtype === "agile") return "🔔"; // Yellow
  return "📩"; // Generic or non-urgent
};

// Function to determine the text for the primary action button
const getActionText = (
  type: "legal" | "distraction",
  subtype?: "family" | "boss" | "agile"
) => {
  if (type === "legal" || subtype === "agile") return "✅ Fixed";
  if (subtype === "family") return "👍 OK";
  if (subtype === "boss") return "👍 Done";
  return "✅ Fixed"; // Default
};

export default function FineAlert({
  message,
  law,
  type,
  subtype,
  escalated,
  isUrgent,
  onClose,
}: FineAlertProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() =>
      setIsDark(root.classList.contains("dark"))
    );
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    setIsDark(root.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // --- STYLING LOGIC ---
  let containerClass = "border p-4 rounded shadow-lg max-w-sm w-full";

  if (escalated && type === "legal") {
    containerClass += isDark
      ? " bg-red-700 border-red-600 text-red-100"
      : " bg-red-100 border-red-400 text-red-800";
  } else if (isUrgent && type === "legal") {
    containerClass += isDark
      ? " bg-orange-700 border-orange-600 text-orange-100"
      : " bg-orange-200 border-orange-400 text-orange-900";
    containerClass += " border-4 border-dashed border-red-500";
  } else if (subtype === "family") {
    containerClass += isDark
      ? " bg-blue-900 border-blue-700 text-blue-100"
      : " bg-blue-100 border-blue-300 text-blue-800";
  } else {
    containerClass += isDark
      ? " bg-yellow-900 border-yellow-700 text-yellow-100"
      : " bg-yellow-100 border-yellow-300 text-yellow-800";
  }

  const buttonBaseClass =
    "px-3 py-1 rounded font-semibold transition-colors duration-200";
  const fixButtonClass = " bg-green-500 hover:bg-green-600 text-white";
  const ignoreButtonClass = " bg-gray-500 hover:bg-gray-600 text-white";
  const closeButtonClass = " bg-blue-500 hover:bg-blue-600 text-white";

  const icon = getMessageIcon({
    message,
    law,
    type,
    subtype,
    escalated,
    isUrgent,
    onClose,
  });

  const actionText = getActionText(type!, subtype);

  return (
    <div
      className={containerClass}
      role={isUrgent ? "alert" : undefined}
      aria-live={isUrgent ? "assertive" : undefined}
    >
      {/* HEADER - ICON + COURT FINE TEXT CENTERED */}
      <p className="font-bold mb-2 flex flex-col items-center justify-center text-center gap-1">
        <span>{icon}</span>
        {escalated && type === "legal" && <span>Courtroom Fine!</span>}
      </p>

      {/* MESSAGE */}
      <p className="mb-3 italic text-center">{message ?? "No message"}</p>

      {/* LAW DETAIL */}
      {type === "legal" && escalated && law && (
        <p className="text-sm font-mono mb-3 text-center">
          Law Broken: <strong>{law}</strong>
        </p>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 justify-center mt-4">
        <button
          onClick={onClose}
          className={`${buttonBaseClass} ${ignoreButtonClass}`}
          title="Dismiss the message without fixing or acknowledging."
        >
          ❌ Ignore
        </button>

        <button
          onClick={onClose}
          className={`${buttonBaseClass} ${fixButtonClass}`}
          title="Address the issue and remove this alert."
        >
          {actionText}
        </button>

        <button
          onClick={onClose}
          className={`${buttonBaseClass} ${closeButtonClass}`}
          title="Acknowledge and close the message."
        >
          🚪 Close
        </button>
      </div>
    </div>
  );
}
