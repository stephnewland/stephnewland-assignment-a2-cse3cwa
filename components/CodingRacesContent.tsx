"use client";

import { useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function CodingRacesContent() {
  useEffect(() => {
    document.cookie = "lastTab=coding-races; path=/";
  }, []);

  return (
    <main
      role="main"
      aria-labelledby="coding-races-heading"
      className="px-4 py-8 space-y-6"
    >
      {/* Breadcrumbs always top-left */}
      <div className="text-left">
        <Breadcrumbs />
      </div>

      <div className="flex flex-col items-center justify-center text-center min-h-[20vh] px-4 space-y-4">
        <h1 id="coding-races-heading" className="big-title">
          Coding Races Page
        </h1>
        <h2>This page is under construction.</h2>
        <p>Please check back later for updates.</p>
      </div>
    </main>
  );
}
