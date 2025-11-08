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
  onFineTriggered?: () => void;
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
  onFineTriggered,
  onFineClosed,
}: MessageQueueProps) {
  const [activeMessages, setActiveMessages] = useState<ActiveMessage[]>([]);
  const messageIdRef = useRef(0);
  const [hydrated, setHydrated] = useState(false);

  const log = (...args: any[]) => console.debug("[MessageQueue]", ...args);
  const generateKey = (msg: ActiveMessage) =>
    `${msg.id}-${msg.timestamp}-${messageIdRef.current}`;

  // ----------------------
  // Add message to queue
  const enqueueMessage = (msg: Message) => {
    const timestamp = Date.now();
    const activeMsg: ActiveMessage = { ...msg, timestamp };
    messageIdRef.current += 1;
    setActiveMessages((prev) => [...prev, activeMsg]);
    log("Enqueued message:", activeMsg);
  };

  // ----------------------
  // Remove message and handle escalation
  const dequeueMessage = (msg: ActiveMessage) => {
    if (msg.type === "legal" && !msg.urgent) {
      // remove and schedule urgent
      setActiveMessages((prev) => prev.filter((m) => m.id !== msg.id));
      log("Legal message ignored — will reappear as urgent in 2 minutes:", msg);

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
      }, 120000); // 2 minutes
    } else {
      setActiveMessages((prev) => prev.filter((m) => m.id !== msg.id));
      log("Dequeued message:", msg);
    }
  };

  // Hydration
  useEffect(() => setHydrated(true), []);

  // ----------------------
  // Scheduler: mix all messages (legal + distractions) every 20–30s
  useEffect(() => {
    if (!hydrated) return;
    const allMessages = messages;
    let messageTimeoutId: NodeJS.Timeout;

    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 10000; // 20–30s
      messageTimeoutId = setTimeout(() => {
        // randomly pick a message from all types
        const random =
          allMessages[Math.floor(Math.random() * allMessages.length)];
        enqueueMessage(random);
        log(
          `Scheduled message after ${Math.round(delay / 1000)}s:`,
          random.text
        );
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (messageTimeoutId) clearTimeout(messageTimeoutId);
    };
  }, [hydrated]);

  // ----------------------
  // Escalation timer: urgent & court
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let courtTriggeredForLaw: string | undefined;

      const nextMessages = activeMessages.map((msg) => {
        log(
          "Checking escalation for:",
          msg.text,
          "Urgent:",
          msg.urgent,
          "Escalated:",
          msg.escalated,
          "urgentTimestamp:",
          msg.urgentTimestamp,
          "now:",
          now
        );

        if (msg.type !== "legal" || msg.escalated) return msg;

        const firstEscalationTime = msg.timestamp + (msg.escalateAfter ?? 0);

        // escalate to fine
        if (msg.urgent) {
          const secondEscalationTime =
            (msg.urgentTimestamp ?? firstEscalationTime) + 120000;
          if (now >= secondEscalationTime) {
            log("CRITICAL: Court fine triggered for:", msg.law);
            courtTriggeredForLaw = msg.law;
            return { ...msg, escalated: true };
          }
        }

        // escalate to urgent if not already
        if (!msg.urgent && now >= firstEscalationTime) {
          log("Message becoming urgent:", msg.text);
          return {
            ...msg,
            urgent: true,
            urgentTimestamp: now,
            text: `URGENT ${msg.text}`,
          };
        }

        return msg;
      });

      setActiveMessages(nextMessages);

      if (courtTriggeredForLaw) onCourtTriggered?.();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMessages, onCourtTriggered]);

  console.log("Active Messages:", activeMessages);

  // ----------------------
  // Render fine alerts with ARIA live region
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
              if (msg.escalated && onFineClosed) onFineClosed(); // overlay disappears only on dismissal
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
