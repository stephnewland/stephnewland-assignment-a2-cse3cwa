"use client";

import React, { useEffect, useState } from "react";
import FineAlert from "./FineAlert";

export interface Message {
  id: string;
  text: string;
  type: "legal" | "distraction";
  subtype?: "family" | "boss" | "agile";
  escalateAfter?: number;
  law?: string;
}

export interface ActiveMessage extends Message {
  timestamp: number;
  urgent?: boolean;
  escalated?: boolean;
}

export interface MessageQueueProps {
  onCourtTriggered?: (law?: string) => void;
  onFineClosed?: () => void;
}

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
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const generateKey = (msg: ActiveMessage) =>
    `${msg.id}-${msg.timestamp}-${Math.random()}`;

  const enqueueMessage = (msg: Message) => {
    if (!hydrated) return;
    const timestamp = Date.now();
    setActiveMessages((prev) => [...prev, { ...msg, timestamp }]);
  };

  const dequeueMessage = (msg: ActiveMessage) => {
    setActiveMessages((prev) =>
      prev.filter((m) => m.timestamp !== msg.timestamp)
    );
    if (msg.escalated) onFineClosed?.();
  };

  // Random messages every 20-30s
  useEffect(() => {
    if (!hydrated) return;
    let timeout: NodeJS.Timeout;
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 10000;
      timeout = setTimeout(() => {
        const random = messages[Math.floor(Math.random() * messages.length)];
        enqueueMessage(random);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeout);
  }, [hydrated]);

  // Escalation → court fine
  useEffect(() => {
    if (!hydrated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      let courtLaw: string | undefined;

      setActiveMessages((prev) =>
        prev.map((msg) => {
          if (msg.type !== "legal" || msg.escalated) return msg;

          const escalationTime = msg.timestamp + (msg.escalateAfter ?? 120000);

          if (!msg.urgent && now >= escalationTime) {
            return { ...msg, urgent: true, text: `⚡ URGENT: ${msg.text}` };
          }

          if (msg.urgent && !msg.escalated && now >= escalationTime + 120000) {
            courtLaw = msg.law;
            return { ...msg, escalated: true };
          }

          return msg;
        })
      );

      if (courtLaw) onCourtTriggered?.(courtLaw);
    }, 1000);

    return () => clearInterval(interval);
  }, [hydrated, onCourtTriggered]);

  if (!hydrated) return null;

  return (
    <div className="fixed top-4 right-4 h-full max-w-sm pointer-events-none z-50">
      <div className="flex flex-col space-y-4 items-end pointer-events-auto max-h-screen overflow-y-auto">
        {activeMessages.map((msg) => (
          <FineAlert
            key={generateKey(msg)}
            message={msg.text}
            law={msg.type === "legal" && msg.escalated ? msg.law ?? "" : ""}
            onClose={() => dequeueMessage(msg)}
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
