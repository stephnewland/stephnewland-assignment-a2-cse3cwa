"use client";
import { useState } from "react";
import Timer from "./Timer";
import MessageQueue from "./MessageQueue";

export default function CourtroomStage() {
  const [stage, setStage] = useState(1);

  const advanceStage = () => {
    setStage((prev) => Math.min(prev + 1, 3));
  };

  return (
    <div>
      <h2>Stage {stage}</h2>
      <Timer onTick={() => {}} />
      {stage === 1 && <p>🛠️ Debug the code below...</p>}
      {stage === 2 && <MessageQueue />}
      {stage === 3 && <p>🔐 Fix accessibility and security issues...</p>}
      <button onClick={advanceStage}>Next Stage</button>
    </div>
  );
}
