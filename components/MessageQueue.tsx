"use client";

import React, { useEffect, useState, useRef } from "react";
import FineAlert from "./FineAlert";

export interface Message {
  id: string;
  text: string;
  type: "legal" | "distraction";
  subtype?: "family" | "boss" | "agile";
  escalateAfter?: number; // ms until urgent
  law?: string;
}

export interface ActiveMessage extends Message {
  timestamp: number; // first appearance
  urgentTimestamp?: number;
  urgent?: boolean;
  escalated?: boolean;
}

export interface MessageQueueProps {
  onCourtTriggered?: () => void;
  onFineClosed?: () => void;
}

// ----------------------
// Message pool
export const messages: Message[] = [
  {
    id: "imgAlt",
    text: "Fix alt in img1",
    type: "legal",
    escalateAfter: 120000,
    law: "Disability Act",
  },
  {
    id: "inputValidation",
    text: "Fix input validation",
    type: "legal",
    escalateAfter: 120000,
    law: "Laws of Tort",
  },
  {
    id: "userLogin",
    text: "Fix User login",
    type: "legal",
    escalateAfter: 120000,
    law: "Bankruptcy Act",
  },
  {
    id: "secureDatabase",
    text: "Fix Secure Database",
    type: "legal",
    escalateAfter: 120000,
    law: "Laws of Tort",
  },
  {
    id: "bossSprint",
    text: "Boss: Are you done with sprint 1?",
    type: "distraction",
    subtype: "boss",
  },
  {
    id: "bossUpdate",
    text: "Boss: I need an update on sprint 1.",
    type: "distraction",
    subtype: "boss",
  },
  {
    id: "familyReminder",
    text: "Family: Can you pick up the kids after work?",
    type: "distraction",
    subtype: "family",
  },
  {
    id: "familyUpdate",
    text: "Family: What are we doing for dinner tonight?",
    type: "distraction",
    subtype: "family",
  },
  {
    id: "agileRequest",
    text: "Agile Team: Change the title color to red",
    type: "distraction",
    subtype: "agile",
  },
];

export default function MessageQueue({
  onCourtTriggered,
  onFineClosed,
}: MessageQueueProps) {
  const [activeMessages, setActiveMessages] = useState<ActiveMessage[]>([]);
  const messageIdRef = useRef(0);
  const finesTriggeredRef = useRef<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  const log = (...args: any[]) => console.debug("[MessageQueue]", ...args);

  const generateKey = (msg: ActiveMessage) =>
    `${msg.id}-${msg.timestamp}-${messageIdRef.current}`;

  // ----------------------
  const enqueueMessage = (msg: Message) => {
    const timestamp = Date.now();
    const activeMsg: ActiveMessage = {
      ...msg,
      timestamp,
      urgent: false,
      escalated: false,
    };
    messageIdRef.current += 1;
    setActiveMessages((prev) => [...prev, activeMsg]);
    log("Enqueued message:", activeMsg);
  };

  const dequeueMessage = (msg: ActiveMessage) => {
    setActiveMessages((prev) =>
      prev.filter((m) => m.timestamp !== msg.timestamp)
    );

    // Reschedule legal messages if they are not yet escalated
    if (msg.type === "legal" && !msg.escalated && !msg.urgent) {
      setTimeout(() => {
        const urgentMsg: ActiveMessage = {
          ...msg,
          timestamp: Date.now(),
          urgent: true,
          urgentTimestamp: Date.now(),
          escalated: false,
          text: `URGENT ${msg.text}`,
        };
        setActiveMessages((prev) => [...prev, urgentMsg]);
        log("Legal message reappeared as urgent:", urgentMsg);
      }, msg.escalateAfter ?? 120000);
    }
  };

  // ----------------------
  useEffect(() => setHydrated(true), []);

  // ---------------------- Random scheduler
  useEffect(() => {
    if (!hydrated) return;
    let timeoutId: NodeJS.Timeout;
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 10000;
      timeoutId = setTimeout(() => {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        enqueueMessage(randomMsg);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [hydrated]);

  // ---------------------- Urgent → escalated → fine logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let courtTriggered = false;

      setActiveMessages((prev) =>
        prev.map((msg) => {
          if (msg.type !== "legal" || msg.escalated) return msg;

          const firstEscalation = msg.timestamp + (msg.escalateAfter ?? 0);

          // Escalate to urgent
          if (!msg.urgent && now >= firstEscalation) {
            log("Message becoming urgent:", msg.text);
            return {
              ...msg,
              urgent: true,
              urgentTimestamp: now,
              text: `URGENT ${msg.text}`,
            };
          }

          // Escalate to court fine
          if (msg.urgent) {
            const secondEscalation =
              (msg.urgentTimestamp ?? firstEscalation) + 120000;
            if (
              now >= secondEscalation &&
              !finesTriggeredRef.current.has(msg.id)
            ) {
              finesTriggeredRef.current.add(msg.id);
              courtTriggered = true;
              log("CRITICAL: Court fine triggered for:", msg.law);
              return { ...msg, escalated: true };
            }
          }

          return msg;
        })
      );

      if (courtTriggered) onCourtTriggered?.();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMessages, onCourtTriggered]);

  // ---------------------- Render FineAlerts
  return (
    <div
      className="message-queue fixed top-4 right-4 h-full w-full max-w-sm pointer-events-none"
      role="region"
      aria-live="polite"
    >
      <div className="flex flex-col space-y-4 items-end pointer-events-auto max-h-screen overflow-y-auto">
        {activeMessages.map((msg) => (
          <FineAlert
            key={generateKey(msg)}
            message={msg.text || "Default message"}
            law={msg.type === "legal" && msg.escalated ? msg.law ?? "" : ""}
            onClose={() => {
              dequeueMessage(msg);
              if (msg.escalated) {
                finesTriggeredRef.current.delete(msg.id);
                onFineClosed?.();
              }
            }}
            type={msg.type}
            subtype={msg.subtype}
            escalated={!!msg.escalated}
            isUrgent={!!msg.urgent}
          />
        ))}
      </div>
    </div>
  );
}
