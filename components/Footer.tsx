"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer({
  studentName,
  studentNumber,
}: {
  studentName: string;
  studentNumber: string;
}) {
  const currentDate = new Date().toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleHomeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = "/";
    }
  };

  return (
    <footer
      className="px-4 py-2 text-sm flex flex-col items-center border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Home link when not on home page */}
      {!isHomePage && (
        <Link
          href="/"
          className="
            py-2 px-4 rounded border
            bg-gray-100 text-gray-900       /* light mode */
            hover:bg-gray-500              /* light mode hover */
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          "
        >
          Home
        </Link>
      )}

      {/* Copyright and student information */}
      <p className="text-center leading-none pt-2">
        &copy; {new Date().getFullYear()} {studentName} — Student No:{" "}
        {studentNumber}
        <br />
        {currentDate}
      </p>
    </footer>
  );
}
