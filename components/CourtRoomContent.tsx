"use client";

import { useEffect, useState } from "react";
import MessageQueue from "./MessageQueue";
import Timer from "./Timer";

interface CourtRoomContentProps {
  onCourtTriggered?: (law?: string) => void;
}

export default function CourtRoomContent({
  onCourtTriggered,
}: CourtRoomContentProps) {
  const [stage, setStage] = useState(1);

  // Stage codes
  const [stage1Code, setStage1Code] = useState(`<img src="/logo.png">`);
  const [stage2Code, setStage2Code] = useState(
    `function validateInput(input) { return input.includes('@'); }`
  );
  const [stage3Code, setStage3Code] = useState(
    `<form><input type="text"><input type="password"><button>Login</button></form>`
  );
  const [stage4Code, setStage4Code] = useState(
    `const db = connect("mongodb://admin:password@localhost:27017/app");`
  );
  const [stage5Code, setStage5Code] = useState(
    `function login(username, password) { /* TODO */ }`
  );
  const [stage6Code, setStage6Code] = useState(
    `const query = "SELECT * FROM users WHERE id=" + userId;`
  );
  const [stage7Code, setStage7Code] = useState(
    `document.querySelector('h1').style.color = 'blue';`
  );
  const [stage8Code] = useState(`// Compliance checklist`);

  // Fine & background state
  const [isFineActive, setIsFineActive] = useState(false);
  const [currentLaw, setCurrentLaw] = useState<string | null>(null);
  const [deskBg, setDeskBg] = useState("/CourtRoomWorkDeskLight.png");
  const [fineBg, setFineBg] = useState("/CourtRoomStageLight.png");

  // Dark/light background switching
  useEffect(() => {
    const updateBackground = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setDeskBg(
        isDark ? "/CourtRoomWorkDeskDark.png" : "/CourtRoomWorkDeskLight.png"
      );
      setFineBg(
        isDark ? "/CourtRoomStageDark.png" : "/CourtRoomStageLight.png"
      );
    };

    updateBackground();

    const observer = new MutationObserver(() => updateBackground());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Reset fine on stage change
  useEffect(() => {
    if (isFineActive) {
      setIsFineActive(false);
      setCurrentLaw(null);
    }
  }, [stage]);

  // Mark fixed validation
  const handleMarkFixed = () => {
    let isValid = false;
    switch (stage) {
      case 1:
        isValid = /<img [^>]*alt=["'][^"']*["']/.test(stage1Code);
        break;
      case 2:
        isValid = !stage2Code.includes("return input.includes('@')");
        break;
      case 3:
        isValid = stage3Code.includes("<label") && stage3Code.includes("input");
        break;
      case 4:
        isValid = !stage4Code.includes("password");
        break;
      case 5:
        isValid = stage5Code.trim().length > 0;
        break;
      case 6:
        isValid =
          stage6Code.includes("db.query") ||
          stage6Code.includes("parameterised");
        break;
      case 7:
        isValid =
          stage7Code.trim() !==
          `document.querySelector('h1').style.color = 'blue';`;
        break;
      case 8:
        isValid = true;
        break;
    }
    if (isValid) setStage((prev) => Math.min(prev + 1, 8));
    else alert("⚠️ Please apply the fix correctly before advancing!");
  };

  // Stage renderer
  const renderStage = (
    title: string,
    instructions: string,
    code: string,
    onChange: (val: string) => void,
    hint: string
  ) => (
    <div className="w-full text-left bg-white/20 dark:bg-black/20 p-4 rounded-lg shadow-md">
      <p className="text-xl font-semibold mb-2">{title}</p>
      <p className="mb-2">{instructions}</p>
      <textarea
        className="w-full bg-gray-900 text-white p-2 rounded text-sm font-mono"
        rows={6}
        value={code}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-gray-400 mt-2 mb-2">💡 Hint: {hint}</p>
      <button
        onClick={handleMarkFixed}
        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
      >
        Mark Fixed
      </button>
    </div>
  );

  // ---------------- Fine handlers
  const handleCourtTriggered = (law?: string) => {
    if (isFineActive) return; // prevent overlapping fines
    setCurrentLaw(law ?? null);
    setIsFineActive(true);

    setTimeout(() => {
      setIsFineActive(false);
      setCurrentLaw(null);
    }, 10000); // red overlay shows for 10s
  };

  const handleFineClosed = () => {
    setIsFineActive(false);
    setCurrentLaw(null);
  };

  return (
    <>
      {/* Red tint overlay: fixed, behind messages */}
      <div
        className={`fixed inset-0 bg-red-500 transition-opacity duration-700 pointer-events-none z-50`}
        style={{ opacity: isFineActive ? 0.2 : 0 }}
      />

      <main className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden">
        {/* Desk background */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover z-0 transition-all duration-700"
          style={{ backgroundImage: `url(${deskBg})` }}
        />

        {/* Fine overlay */}
        <div
          className={`absolute inset-0 bg-center bg-no-repeat bg-cover transition-opacity duration-700 pointer-events-none z-10 ${
            isFineActive ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${fineBg})` }}
        />

        {/* Content */}
        <div className="relative z-30 w-full flex flex-col items-center px-4 py-8 space-y-6 max-w-4xl">
          <h1 id="court-room-heading" className="big-title text-center">
            Court Room Challenge
          </h1>
          <Timer onTimerEnd={() => {}} />
          <p className="text-lg">
            Current Stage: <strong>{stage}</strong> / 8
          </p>

          {stage === 1 &&
            renderStage(
              "🧩 Stage 1: Debugging HTML",
              "Fix broken or missing alt attributes:",
              stage1Code,
              setStage1Code,
              '💡 Hint: Include an alt="" attribute in your <img> tag.'
            )}
          {stage === 2 &&
            renderStage(
              "⚙️ Stage 2: Input Validation",
              "Strengthen validation function:",
              stage2Code,
              setStage2Code,
              "💡 Hint: Use regex or stronger checks instead of a simple '@' check."
            )}
          {stage === 3 &&
            renderStage(
              "🔐 Stage 3: Secure Login Form",
              "Make this form secure and accessible:",
              stage3Code,
              setStage3Code,
              "💡 Hint: Add <label> elements for all inputs and ensure accessibility."
            )}
          {stage === 4 &&
            renderStage(
              "🧱 Stage 4: Secure Database Connection",
              "Review DB connection code:",
              stage4Code,
              setStage4Code,
              "💡 Hint: Never hardcode passwords in your connection strings."
            )}
          {stage === 5 &&
            renderStage(
              "📦 Stage 5: Fix User Login",
              "Ensure error handling:",
              stage5Code,
              setStage5Code,
              "💡 Hint: Catch errors and provide proper feedback to users."
            )}
          {stage === 6 &&
            renderStage(
              "🔒 Stage 6: Secure Database Fixes",
              "Protect against SQL injection:",
              stage6Code,
              setStage6Code,
              "💡 Hint: Use parameterized queries or prepared statements."
            )}
          {stage === 7 &&
            renderStage(
              "📝 Stage 7: Agile Requests",
              "Apply requested UI changes:",
              stage7Code,
              setStage7Code,
              "💡 Hint: Make meaningful changes and don’t leave hardcoded values."
            )}
          {stage === 8 && (
            <div className="w-full text-left bg-white/20 dark:bg-black/20 p-4 rounded-lg shadow-md">
              <p className="text-xl font-semibold mb-2">
                ⚖️ Stage 8: Compliance Review
              </p>
              <p className="mb-2">
                Review your web app for accessibility and data protection
                compliance:
              </p>
              <ul className="list-disc pl-6 text-left text-gray-200">
                <li>Check all images have alt text.</li>
                <li>Ensure all inputs are labeled.</li>
                <li>Verify data is encrypted in transit (HTTPS).</li>
                <li>Validate and sanitize all user input.</li>
              </ul>
              <p className="text-gray-400 mt-2">
                💡 Hint: Think like a security auditor — fix before court fines
                are issued!
              </p>
            </div>
          )}

          {/* MessageQueue */}
          <MessageQueue
            onCourtTriggered={handleCourtTriggered}
            onFineClosed={handleFineClosed}
          />

          {/* Navigation */}
          <div className="flex gap-4 mt-4">
            {stage > 1 && (
              <button
                onClick={() => setStage((prev) => Math.max(prev - 1, 1))}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
              >
                Previous Stage
              </button>
            )}
            {stage < 8 && (
              <button
                onClick={() => setStage((prev) => Math.min(prev + 1, 8))}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Next Stage
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
