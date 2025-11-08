"use client";

import React, { useState, useEffect } from "react";

export interface FineAlertProps {
  message: string;
  law?: string;
  onClose: () => void;
  type?: "legal" | "distraction";
  subtype?: "family" | "boss" | "agile";
  escalated?: boolean;
  isUrgent?: boolean;
}

// Function to determine the icon based on the message details
const getMessageIcon = (props: FineAlertProps) => {
  if (props.type === "legal") {
    if (props.escalated) return "🚨"; // Final fine (Red)
    if (props.isUrgent) return "⚡"; // Urgent legal (Orange)
  }
  if (props.subtype === "family") return "💬";
  if (props.subtype === "boss") return "📝";
  if (props.subtype === "agile") return "🔔";
  return "📩"; // generic new messages or non-urgent legal (Yellow)
};

// Function to determine the text for the primary action button
const getActionText = (
  type: "legal" | "distraction",
  subtype?: "family" | "boss" | "agile"
) => {
  if (type === "legal" || subtype === "boss" || subtype === "agile") {
    return "✅ Fixed";
  }
  if (subtype === "family") {
    return "👍 OK";
  }
  return "✅ Fixed"; // Default for any uncategorized message
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

  // Dark mode observer
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    setIsDark(root.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // --- STYLING LOGIC ---
  let containerClass = "border p-4 rounded shadow-lg max-w-sm w-full";
  let buttonBaseClass =
    "px-3 py-1 rounded font-semibold transition-colors duration-200";

  // 1. Final Fine (Escalated Legal) - RED
  if (escalated && type === "legal") {
    containerClass += isDark
      ? " bg-red-700 border-red-600 text-red-100"
      : " bg-red-100 border-red-400 text-red-800";
  }
  // 2. Urgent Legal Message - ORANGE
  else if (isUrgent && type === "legal") {
    containerClass += isDark
      ? " bg-orange-700 border-orange-600 text-orange-100"
      : " bg-orange-200 border-orange-400 text-orange-900";
    containerClass += " border-4 border-dashed border-red-500";
  }
  // 3. Family Messages - BLUE
  else if (subtype === "family") {
    containerClass += isDark
      ? " bg-blue-900 border-blue-700 text-blue-100"
      : " bg-blue-100 border-blue-300 text-blue-800";
  }
  // 4. Other Distractions / Non-Urgent Legal - YELLOW
  else {
    containerClass += isDark
      ? " bg-yellow-900 border-yellow-700 text-yellow-100"
      : " bg-yellow-100 border-yellow-300 text-yellow-800";
  }

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
      className={`${containerClass}`}
      role={isUrgent ? "alert" : undefined} // urgent messages are announced immediately
      aria-live={isUrgent ? "assertive" : undefined}
    >
      {/* HEADER */}
      <p className="font-bold mb-2">
        {icon}{" "}
        {escalated && type === "legal" ? (
          <span className="ml-2">Courtroom Fine!</span>
        ) : null}
      </p>

      <p className="mb-3 italic">{message ?? "No message"}</p>

      {type === "legal" && escalated && law ? (
        <p className="text-sm font-mono mb-3">
          Law Broken: <strong>{law}</strong>
        </p>
      ) : null}

      {/* INLINE ACTION BUTTONS */}
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
