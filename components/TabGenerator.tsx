"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, Copy } from "lucide-react";

interface Tab {
  id: number;
  header: string;
  content: string;
}

export default function TabGenerator() {
  const demoPresets: Record<number, Tab[]> = {
    1: [{ id: 1, header: "Step 1", content: "Step 1 Content" }],
    3: [
      { id: 1, header: "Step 1", content: "Step 1 Content" },
      { id: 2, header: "Step 2", content: "Step 2 Content" },
      { id: 3, header: "Step 3", content: "Step 3 Content" },
    ],
    5: [
      { id: 1, header: "Step 1", content: "Step 1 Content" },
      { id: 2, header: "Step 2", content: "Step 2 Content" },
      { id: 3, header: "Step 3", content: "Step 3 Content" },
      { id: 4, header: "Step 4", content: "Step 4 Content" },
      { id: 5, header: "Step 5", content: "Step 5 Content" },
    ],
  };

  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Theme Detection ---
  useEffect(() => {
    const initialIsDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(initialIsDark);
    setIsInitialized(true);

    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // --- Handlers ---
  const addTab = () => {
    const newId = tabs.length > 0 ? Math.max(...tabs.map((t) => t.id)) + 1 : 1;
    const newTab = {
      id: newId,
      header: `Step ${newId}`,
      content: `Step ${newId} Content`,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const removeTab = (id: number) => {
    const updatedTabs = tabs.filter((t) => t.id !== id);
    setTabs(updatedTabs);
    if (activeTabId === id) setActiveTabId(updatedTabs[0]?.id ?? null);
  };

  const updateTab = (
    id: number,
    field: "header" | "content",
    value: string
  ) => {
    setTabs(tabs.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  // A11y Fix: Wrapped in useCallback and added e.preventDefault()
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (!tabs.length) return;
      const tabCount = tabs.length;
      let nextIndex = index;

      if (e.key === "ArrowRight") {
        nextIndex = (index + 1) % tabCount;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabCount) % tabCount;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = tabCount - 1;
      }

      if (nextIndex !== index) {
        setActiveTabId(tabs[nextIndex].id);
        e.preventDefault(); // Crucial for A11y: stops browser scrolling
      }
    },
    [tabs]
  );

  const generateHTML = () => {
    // Switched to using Tailwind CDN and classes for better style control in output
    const headContent = `
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Tabs Example</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      .tab-content { display: none; }
      .tab-content.active { display: block; }
      /* Ensure focus styles carry over to generated HTML for consistency */
      .tab-button:focus { 
          outline: none; 
          /* This reflects the ring-2 blue-500 focus:ring-offset-2 behavior */
          box-shadow: 0 0 0 2px white, 0 0 0 4px #3b82f6; 
          position: relative;
          z-index: 10;
      }
      .tab-button.active { 
          background-color: #3b82f6; /* Blue-500 */
          color: white; 
      }
      /* Ensure the generated HTML also supports basic dark mode colors */
      @media (prefers-color-scheme: dark) {
        body { background-color: #121212; color: #f0f0f0; }
        .tab-panels > div { background-color: #1f2937; color: #e5e7eb; border-color: #4b5563; } /* dark:bg-gray-800 */
        .tab-panels > div h3 { color: #f9fafb; }
      }
    </style>
</head>`;

    const buttons = tabs
      .map(
        (t, index) =>
          `<button 
            class="tab-button py-2 px-4 rounded-md text-sm font-medium border transition-colors hover:bg-blue-100 ${
              index === 0 ? "active" : ""
            }" 
            onclick="openTab(this, 'tab-${t.id}')" 
            data-tab-id="tab-${t.id}"
          >
            ${t.header}
          </button>`
      )
      .join("\n");

    const contents = tabs
      .map(
        (t, index) =>
          `<div id="tab-${t.id}" class="tab-content ${
            index === 0 ? "active" : ""
          } p-6 border border-t-0 bg-white shadow-md">
            <h3 class="text-xl font-semibold mb-2">${t.header}</h3>
            <p class="text-gray-700">${t.content.replace(/\n/g, "<br>")}</p>
          </div>`
      )
      .join("\n");

    const script = `
<script>
function openTab(evt, tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
  const activeContent = document.getElementById(tabId);
  if (activeContent) activeContent.classList.add('active');
  if (evt) evt.classList.add('active');
}
document.addEventListener('DOMContentLoaded', () => {
  const firstButton = document.querySelector('.tab-button');
  if (firstButton) openTab(firstButton, firstButton.getAttribute('data-tab-id'));
});
</script>
`;
    return `<!DOCTYPE html>
<html lang="en">
${headContent}
<body class="p-8 bg-gray-50 font-sans">
  <div class="max-w-4xl mx-auto rounded-xl shadow-2xl bg-white">
    <div class="flex flex-wrap border-b border-gray-200">${buttons}</div>
    <div class="tab-panels">${contents}</div>
  </div>
${script}
</body>
</html>`;
  };

  const preloadTabs = (count: number) => {
    const exampleTabs = demoPresets[count];
    setTabs(exampleTabs);
    setActiveTabId(exampleTabs[0]?.id || null);
  };

  const copyToClipboard = async () => {
    try {
      const text = generateHTML();
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (!successful) throw new Error("Copy command failed");

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback message could be displayed here if execCommand fails
    }
  };

  // --- Loading State (If theme is not yet determined) ---
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </div>
    );
  }

  // Helper function to define the panel's background color based on theme
  const panelClasses = (isDark: boolean) =>
    isDark
      ? "bg-gray-700 text-gray-100 border-gray-600"
      : "bg-blue-50 text-gray-900 border-blue-200";

  // Helper function to define the panel's ring offset color for focus styles
  // This matches the internal panel background (bg-blue-50 or bg-gray-700)
  const ringOffsetClasses = (isDark: boolean) =>
    isDark ? "focus:ring-offset-gray-700" : "focus:ring-offset-blue-50";

  const activeTab = tabs.find((t) => t.id === activeTabId);

  //Save Function after CRUD operations
  const saveOutput = async () => {
    if (!tabs.length) return; // nothing to save

    try {
      const htmlContent = generateHTML(); // your generated HTML
      const response = await fetch("/api/output", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Generated Tabs Output", // optionally make dynamic
          content: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error saving output: " + (errorData.error || "Unknown error"));
        return;
      }

      const data = await response.json();
      alert(`Saved successfully! ID: ${data.id}`);
    } catch (err) {
      console.error("Save failed:", err);
      alert("An unexpected error occurred while saving.");
    }
  };

  // via lambda
  const generateDynamicHTML = async () => {
    if (!tabs.length) return;

    try {
      const response = await fetch("/api/generate-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabs }),
      });

      if (!response.ok) throw new Error("Failed to generate HTML");

      const htmlPage = await response.text();
      console.log(htmlPage);

      // open in new tab
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(htmlPage);
        newWindow.document.close();
      }
    } catch (err) {
      console.error(err);
      alert("Error generating dynamic HTML");
    }
  };

  // --- Component JSX ---
  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDarkMode ? "text-gray-100" : "text-gray-900"
      }`}
    >
      <div className="container mx-auto p-4 sm:p-8">
        <h1
          className={`text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600`}
        >
          Tab Generator
        </h1>

        <div role="main" className="w-full mx-auto space-y-8 max-w-6xl">
          {/* Grid Panels */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Define Tabs Panel (Left Side) */}
            <div
              className={`p-6 rounded-xl shadow-xl border flex flex-col w-full flex-1 ${panelClasses(
                isDarkMode!
              )}`}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center border-b pb-3">
                Define Your Tabs
              </h2>

              {/* Demo Tabs Buttons - Updated dark mode background to gray-400 as requested */}
              <div className="flex space-x-2 mb-4 p-2 rounded-lg bg-white dark:bg-gray-400 shadow-inner border border-gray-200 dark:border-gray-600">
                <span className="self-center font-semibold text-sm">
                  Demo Tabs:
                </span>
                <button
                  onClick={() => preloadTabs(1)}
                  className={`py-1 px-3 text-xs sm:text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${ringOffsetClasses(
                    isDarkMode!
                  )}`}
                >
                  1 Tab
                </button>
                <button
                  onClick={() => preloadTabs(3)}
                  className={`py-1 px-3 text-xs sm:text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${ringOffsetClasses(
                    isDarkMode!
                  )}`}
                >
                  3 Tabs
                </button>
                <button
                  onClick={() => preloadTabs(5)}
                  className={`py-1 px-3 text-xs sm:text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${ringOffsetClasses(
                    isDarkMode!
                  )}`}
                >
                  5 Tabs
                </button>
              </div>

              {/* List of Tabs for Editing */}
              <div
                role="tablist"
                aria-label="Tab Headers"
                className="flex flex-col space-y-2 max-h-96 overflow-y-auto pr-2"
              >
                {tabs.map((tab, idx) => (
                  <div
                    key={tab.id}
                    // Simplified wrapper to only highlight the active container, relying on the button for the main active style
                    className={`flex items-center space-x-2 p-1 rounded-lg transition-colors 
                        ${
                          activeTabId === tab.id
                            ? "bg-white/20 dark:bg-gray-600/50 shadow-inner" // Subtle BG change for active item container
                            : "hover:bg-white/50 dark:hover:bg-gray-800/50"
                        }
                    `}
                  >
                    {/* Primary Tab Selection Button */}
                    <button
                      role="tab"
                      aria-selected={activeTabId === tab.id}
                      onClick={() => setActiveTabId(tab.id)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      tabIndex={activeTabId === tab.id ? 0 : -1}
                      className={`
                        py-2 px-4 w-full rounded-md text-sm font-medium border transition-all text-left truncate
                        // Explicitly setting ring offset color to match panel background for visibility
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${ringOffsetClasses(
                          isDarkMode!
                        )}
                        ${
                          activeTabId === tab.id
                            ? // Ensure strong contrast for the active tab button
                              isDarkMode
                              ? "bg-blue-600 text-white shadow-lg border-blue-700"
                              : "bg-blue-500 text-white shadow-lg border-blue-600"
                            : isDarkMode
                            ? "bg-gray-600 text-gray-200 border-gray-500 hover:bg-gray-500"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }
                      `}
                    >
                      {tab.header}
                    </button>

                    {/* Tab Removal Button */}
                    {tabs.length > 1 && (
                      <button
                        onClick={() => removeTab(tab.id)}
                        aria-label={`Remove ${tab.header}`}
                        // Styled the X button for better visibility and focus
                        className={`text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md flex-shrink-0 ${ringOffsetClasses(
                          isDarkMode!
                        )}`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Tab Button - Color is now a darker green (600/700) */}
                <button
                  onClick={addTab}
                  className={`py-2 px-4 border rounded-lg mt-4 bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-md flex items-center justify-center space-x-2 
                  // Explicitly setting ring offset color to match panel background for visibility
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${ringOffsetClasses(
                    isDarkMode!
                  )}`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Tab</span>
                </button>
              </div>
            </div>

            {/* Edit Tab Content Panel (Right Side) */}
            <div
              className={`p-6 rounded-xl shadow-xl border flex flex-col w-full flex-1 ${panelClasses(
                isDarkMode!
              )}`}
            >
              <h2 className="text-2xl font-semibold mb-4 text-center border-b pb-3">
                Edit Tab Content
              </h2>
              {activeTab && (
                <div
                  key={activeTab.id}
                  className="space-y-4 flex flex-col h-full"
                >
                  {/* Header Input */}
                  <input
                    type="text"
                    value={activeTab.header}
                    onChange={(e) =>
                      updateTab(activeTab.id, "header", e.target.value)
                    }
                    // Added explicit ring offset to input fields
                    className={`w-full p-3 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 ${ringOffsetClasses(
                      isDarkMode!
                    )} ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-100 border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                    placeholder="Tab Header"
                  />
                  {/* Content Textarea */}
                  <textarea
                    value={activeTab.content}
                    onChange={(e) =>
                      updateTab(activeTab.id, "content", e.target.value)
                    }
                    // Added explicit ring offset to textarea fields
                    className={`w-full h-40 p-3 border rounded-lg resize-y shadow-inner min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${ringOffsetClasses(
                      isDarkMode!
                    )} ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-100 border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                    placeholder="Tab Content"
                  />
                </div>
              )}
              {!activeTab && tabs.length > 0 && (
                <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">
                  Select a tab on the left to edit its content.
                </p>
              )}
              {tabs.length === 0 && (
                <p className="text-center text-lg text-gray-500 dark:text-gray-400 mt-10">
                  Start by adding a tab or using a preset from the left!
                </p>
              )}
            </div>
          </div>

          {/* Generated HTML Panel */}
          <div
            className={`p-6 rounded-xl shadow-xl border w-full ${panelClasses(
              isDarkMode!
            )}`}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-2xl font-semibold">Generated HTML Output</h2>
              <div className="flex space-x-3">
                {/* Show/Hide HTML Button */}
                <button
                  onClick={() => setShowHtml(!showHtml)}
                  className={`py-2 px-4 border rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-md hover:ring-2 hover:ring-blue-500 transition-all 
                  // Explicitly setting ring offset color
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${ringOffsetClasses(
                    isDarkMode!
                  )}`}
                >
                  {showHtml ? "Hide Code" : "Show Code"}
                </button>
                {/* Copy Button */}
                <button
                  onClick={copyToClipboard}
                  className={`py-2 px-4 border rounded-md text-white font-semibold shadow-md transition-colors flex items-center space-x-1 
                    // Explicitly setting ring offset color
                    focus:outline-none focus:ring-2 focus:ring-offset-2 ${ringOffsetClasses(
                      isDarkMode!
                    )} ${
                    copied
                      ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300"
                  }`}
                  title="Copy HTML to clipboard"
                  disabled={!tabs.length}
                >
                  <Copy className="w-5 h-5" />
                  <span>{copied ? "Copied!" : "Copy HTML"}</span>
                </button>
              </div>
            </div>

            {/*Save button */}
            <button
              onClick={saveOutput}
              className="py-2 px-4 border rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              disabled={!tabs.length}
            >
              Save Output
            </button>

            {/*HTML button */}
            <button
              onClick={generateDynamicHTML}
              className="py-2 px-4 border rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Generate Dynamic HTML
            </button>

            {/* HTML Code Block Display */}
            {showHtml && tabs.length > 0 && (
              <div>
                <pre
                  // FIX: Conditional styling for light/dark mode for code block
                  className={`p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono leading-relaxed border 
                    ${
                      isDarkMode
                        ? "bg-gray-900 text-green-300 border-gray-800" // Dark Mode: dark background, light text
                        : "bg-gray-100 text-gray-900 border-gray-300" // Light Mode: light background, dark text
                    }`}
                >
                  <code>{generateHTML()}</code>
                </pre>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  The generated HTML includes the same focus styles for
                  accessibility.
                </p>
              </div>
            )}
            {/* Message if no tabs are defined */}
            {tabs.length === 0 && showHtml && (
              <p className="text-center text-lg text-gray-500 dark:text-gray-400 p-8">
                Start by adding a tab or using a preset above to generate HTML
                code.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
