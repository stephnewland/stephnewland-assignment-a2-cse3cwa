"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbRef = useRef<HTMLOListElement>(null);

  // Conditional check to hide breadcrumbs on the home page
  if (pathname === "/") {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent, href?: string) => {
    if (!breadcrumbRef.current) return;

    const links = breadcrumbRef.current.querySelectorAll(
      "a[href]"
    ) as NodeListOf<HTMLAnchorElement>;
    const linksArray = Array.from(links);
    const currentIndex = linksArray.findIndex((link) => link === e.target);

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < linksArray.length - 1) {
          linksArray[currentIndex + 1].focus();
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex > 0) {
          linksArray[currentIndex - 1].focus();
        }
        break;
      case "Home":
        e.preventDefault();
        linksArray[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        linksArray[linksArray.length - 1]?.focus();
        break;
      case "Enter":
      case " ":
        if (href && e.target instanceof HTMLAnchorElement) {
          e.preventDefault();
          window.location.href = href;
        }
        break;
    }
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      role="navigation"
      className="text-sm mb-0"
    >
      <p className="sr-only">
        Navigate breadcrumbs with arrow keys, Home, or End. Press Enter to
        follow links.
      </p>
      <ol
        ref={breadcrumbRef}
        className="breadcrumbs flex flex-wrap gap-2 text-gray-700 dark:text-gray-200"
      >
        <li>
          <Link
            href="/"
            className="hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
            onKeyDown={(e) => handleKeyDown(e, "/")}
            tabIndex={0}
          >
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const label = decodeURIComponent(segment).replace(/-/g, " ");

          return (
            <li key={href} className="flex items-center gap-2">
              <span
                className="separator text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              >
                &nbsp;/&nbsp;
              </span>
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-bold text-gray-900 dark:text-white px-1"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="hover:underline font-medium text-blue-700 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                  onKeyDown={(e) => handleKeyDown(e, href)}
                  tabIndex={0}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
