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
  urgentTimestamp?: number; // when urgent applied
  urgent?: boolean;
  escalated?: boolean;
}

export interface MessageQueueProps {
  onCourtTriggered?: () => void;
  onFineTriggered?: () => void;
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
  onFineTriggered,
  onFineClosed,
}: MessageQueueProps) {
  const [activeMessages, setActiveMessages] = useState<ActiveMessage[]>([]);
  const messageIdRef = useRef(0);
  const [hydrated, setHydrated] = useState(false);

  const log = (...args: any[]) => console.debug("[MessageQueue]", ...args);
  const generateKey = (msg: ActiveMessage) =>
    `${msg.id}-${msg.timestamp}-${messageIdRef.current}`;

  const enqueueMessage = (msg: Message) => {
    const timestamp = Date.now();
    const activeMsg: ActiveMessage = { ...msg, timestamp };
    messageIdRef.current += 1;
    setActiveMessages((prev) => [...prev, activeMsg]);
    log("Enqueued message:", activeMsg);
  };

  const dequeueMessage = (msg: ActiveMessage) => {
    if (msg.type === "legal" && !msg.urgent) {
      // Remove the message and schedule it to reappear as urgent
      setActiveMessages((prev) => prev.filter((m) => m.id !== msg.id));
      log("Legal message ignored — will reappear as urgent in 2 minutes:", msg);

      setTimeout(() => {
        const urgentMsg: ActiveMessage = {
          ...msg,
          timestamp: Date.now(),
          urgent: true,
          urgentTimestamp: Date.now(),
          escalated: false,
          text: `urgent ${msg.text}`,
        };
        setActiveMessages((prev) => [...prev, urgentMsg]);
        log("Legal message reappeared as urgent:", urgentMsg);
      }, 120000); // 2 minutes
    } else {
      // Remove non-legal or already urgent messages
      setActiveMessages((prev) => prev.filter((m) => m.id !== msg.id));
      log("Dequeued message:", msg);
    }
  };
  // Hydration
  useEffect(() => setHydrated(true), []);

  // Distractions: random 20-30s
  // ------------------------
  useEffect(() => {
    if (!hydrated) return;

    const distractions = messages.filter((m) => m.type === "distraction");
    let messageTimeoutId: NodeJS.Timeout | undefined;
    let initialDelayId: NodeJS.Timeout | undefined;

    const scheduleNextMessage = () => {
      const delay = 20000 + Math.random() * 10000; // 20–30s
      messageTimeoutId = setTimeout(() => {
        const random =
          distractions[Math.floor(Math.random() * distractions.length)];
        enqueueMessage(random);
        log(
          `Distraction enqueued after ${Math.round(delay / 1000)}s: ${
            random.text
          }`
        );
        scheduleNextMessage(); // recursively schedule next
      }, delay);
    };

    // ⏳ Start scheduling after 20s
    initialDelayId = setTimeout(() => {
      scheduleNextMessage();
    }, 20000);

    // Cleanup: clear the timeout when the component unmounts
    return () => {
      if (initialDelayId) clearTimeout(initialDelayId);
      if (messageTimeoutId) clearTimeout(messageTimeoutId);
    };
  }, [hydrated]);

  // Legal messages: random initial appearance + escalation
  useEffect(() => {
    if (!hydrated) return;

    const legalMessages = messages.filter((m) => m.type === "legal");
    const timers: NodeJS.Timeout[] = [];
    let initialDelayId: NodeJS.Timeout;

    const scheduleLegalMessages = () => {
      legalMessages.forEach((msg) => {
        const delay = 20000 + Math.random() * 10000; // 20–30s
        const t = setTimeout(() => {
          enqueueMessage(msg);
          log(
            `Legal message "${msg.text}" appeared after ${Math.round(
              delay / 1000
            )}s`
          );
        }, delay);
        timers.push(t);
      });
    };

    // ⏳ Start scheduling after 20s
    initialDelayId = setTimeout(scheduleLegalMessages, 20000);

    return () => {
      clearTimeout(initialDelayId);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [hydrated]);

  // Escalation timer: urgent & court
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
          msg.escalated
        );

        if (msg.type !== "legal" || msg.escalated) {
          return msg;
        }

        const firstEscalationTime = msg.timestamp + (msg.escalateAfter ?? 0);

        // Escalate to fine
        if (msg.urgent) {
          const secondEscalationTime =
            (msg.urgentTimestamp ?? firstEscalationTime) + 120000;

          const timeLeft = secondEscalationTime - now;
          log(
            `Time left until fine: ${Math.max(0, Math.round(timeLeft / 1000))}s`
          );

          if (now >= secondEscalationTime) {
            log("CRITICAL: Court fine triggered for:", msg.law);
            courtTriggeredForLaw = msg.law;
            return { ...msg, escalated: true };
          }
        }

        // Escalate to urgent
        if (!msg.urgent && now >= firstEscalationTime) {
          log("Message becoming urgent:", msg.text);
          return {
            ...msg,
            urgent: true,
            urgentTimestamp: Date.now(),
            text: `URGENT ${msg.text}`,
          };
        }

        return msg;
      });

      setActiveMessages(nextMessages);

      if (courtTriggeredForLaw) {
        onCourtTriggered?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeMessages, onCourtTriggered]);

  // Render fine alerts
  return (
    <div className="message-queue fixed top-4 right-4 h-full w-full max-w-sm pointer-events-none">
      <div className="flex flex-col space-y-4 items-end pointer-events-auto max-h-screen overflow-y-auto">
        {activeMessages.map((msg) => (
          <FineAlert
            key={generateKey(msg)}
            message={msg.text || "Default message"}
            law={msg.type === "legal" && msg.escalated ? msg.law ?? "" : ""}
            onClose={() => {
              dequeueMessage(msg);
              if (msg.escalated && onFineClosed) {
                onFineClosed(); // Revert background when fine is dismissed
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
