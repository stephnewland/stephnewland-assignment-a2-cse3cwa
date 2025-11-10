"use client";

import { useEffect } from "react";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function AboutContent() {
  const { containerRef } = useKeyboardNavigation({
    wrapAround: true,
    enableArrowKeys: true,
    enableHomeEnd: true,
  });

  useEffect(() => {
    document.title = "About - CSE3CWA";
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-8"
      ref={containerRef as React.RefObject<HTMLDivElement>}
    >
      <div className="container mx-auto">
        <div>
          <header className="mb-12 text-center pt-2 pb-1">
            <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              About CSE3CWA
            </h1>

            <p className="text-xl max-w-2xl mx-auto mb-6 custom-paragraph">
              A comprehensive web application demonstrating modern full-stack
              development principles and practices.
            </p>

            {/* Personal Information */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border dark:border-blue-800 rounded-lg p-6 max-w-md mx-auto mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Developer Information
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-200">
                <strong>Name:</strong> Steph Newland
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-200">
                <strong>Student Number:</strong> 21993608
              </p>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <div
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              tabIndex={0}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Project Overview
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                CSE3CWA represents a modern approach to web development,
                incorporating cutting-edge technologies and best practices to
                create an engaging, accessible, and performant user experience.
              </p>
            </div>

            <div
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              tabIndex={0}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Key Features
                </h2>
              </div>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Responsive design across all devices
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Full keyboard navigation support
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Modern React and Next.js architecture
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Accessible UI components
                </li>
              </ul>
            </div>
          </div>

          <div
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 mt-8 hover:shadow-xl transition-shadow duration-300"
            tabIndex={0}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
                Technology Stack
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  React
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Frontend Framework
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-black dark:text-white mb-2">
                  Next.js
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Full-stack Framework
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400 mb-2">
                  TypeScript
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Type Safety
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                <div className="text-2xl font-bold text-teal-500 dark:text-teal-400 mb-2">
                  Tailwind
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Styling
                </p>
              </div>
            </div>
          </div>

          {/* Combined Video Tutorial Section */}
          <section
            aria-labelledby="videos-heading"
            className="w-full mx-auto space-y-8 mt-8"
          >
            <h2
              id="videos-heading"
              className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center"
            >
              Project Video Demonstrations
            </h2>

            {/* Grid for side-by-side videos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Video 1: Project Overview */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
                  A1 Video Demo
                </h3>
                <div
                  className="w-full rounded-lg shadow-md overflow-hidden mx-auto"
                  style={{
                    aspectRatio: "16 / 9",
                    marginBottom: "2rem",
                  }}
                >
                  <video
                    controls
                    className="w-full h-full"
                    aria-label="Video tutorial on how to use this website"
                  >
                    <source src="/demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  This video demonstrates how to use the Tab Generator to create
                  accessible HTML5 tab structures that can be deployed directly
                  to Moodle LMS.
                  <SpeedInsights />
                </p>
              </div>

              {/* Video 2: A2 Assignment Demo Video */}
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
                  A2 Video Demo
                </h3>
                <div
                  className="w-full rounded-lg shadow-md overflow-hidden mx-auto"
                  style={{
                    aspectRatio: "16 / 9",
                    marginBottom: "2rem",
                  }}
                >
                  <video
                    controls
                    className="w-full h-full"
                    aria-label="Video tutorial on how to use this website"
                  >
                    <source src="/A2demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                {/* Optional: Add a description for the A2 video if needed */}
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  This video provides a demonstration of the features developed
                  for the A2 assignment in the Court Room Scenario.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
