"use client";

import ThemeToggle from "./ThemeToggle";
import Navbar from "./Navbar";
import styles from "./Header.module.css";
import { useState, useRef, useEffect } from "react";

export default function Header({ studentNumber }: { studentNumber: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/tabs", label: "Tabs" },
    { href: "/escape-room", label: "Escape Room" },
    { href: "/coding-races", label: "Coding Races" },
    { href: "/court-room", label: "Court Room" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavKeyDown = (
    e: React.KeyboardEvent,
    isDesktop: boolean = true
  ) => {
    const currentNav = isDesktop ? navRef.current : mobileNavRef.current;
    if (!currentNav) return;

    const links = currentNav.querySelectorAll(
      "a[href]"
    ) as NodeListOf<HTMLAnchorElement>;
    const linksArray = Array.from(links);
    const currentIndex = linksArray.findIndex((link) => link === e.target);

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        linksArray[(currentIndex + 1) % linksArray.length].focus();
        break;
      case "ArrowLeft":
        e.preventDefault();
        linksArray[
          (currentIndex - 1 + linksArray.length) % linksArray.length
        ].focus();
        break;
      case "Home":
        e.preventDefault();
        linksArray[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        linksArray[linksArray.length - 1]?.focus();
        break;
      case "Escape":
        if (!isDesktop && isMenuOpen) {
          e.preventDefault();
          closeMenu();
          hamburgerRef.current?.focus();
        }
        break;
    }
  };

  const handleHamburgerKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        toggleMenu();
        if (!isMenuOpen) {
          setTimeout(() => {
            const firstLink = mobileNavRef.current?.querySelector(
              "a[href]"
            ) as HTMLAnchorElement;
            firstLink?.focus();
          }, 100);
        }
        break;
      case "Escape":
        if (isMenuOpen) {
          e.preventDefault();
          closeMenu();
        }
        break;
    }
  };

  // Global escape listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      {/* Screen reader instructions */}
      <div className="sr-only">
        <p>
          Main navigation: Use arrow keys to navigate between menu items,
          Home/End to jump to first/last item.
        </p>
        <p>Mobile menu: Press Escape to close menu.</p>
      </div>

      {/* Top row with proper padding */}
      <div className={`${styles.topRow} px-8 pt-2 pb-2`}>
        <span className={styles.studentNumber}>
          Student No: {studentNumber}
        </span>

        <div className={styles.topRightControls}>
          {/* Keep hamburger to the far right */}
          <div
            ref={hamburgerRef}
            onClick={toggleMenu}
            onKeyDown={handleHamburgerKeyDown}
            className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              bg-gray-200 dark:bg-gray-400 text-gray-800 dark:text-gray-100`}
            role="button"
            tabIndex={0}
            aria-label={isMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <div className={isMenuOpen ? styles.barOpen : styles.bar}></div>
            <div className={isMenuOpen ? styles.barOpen : styles.bar}></div>
            <div className={isMenuOpen ? styles.barOpen : styles.bar}></div>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* Navbar now only handles nav links & mobile menu */}
      <Navbar
        navigationItems={navigationItems}
        isMenuOpen={isMenuOpen}
        //toggleMenu={toggleMenu}
        closeMenu={closeMenu}
        handleNavKeyDown={handleNavKeyDown}
        //handleHamburgerKeyDown={handleHamburgerKeyDown}
        //hamburgerRef={hamburgerRef}
        mobileNavRef={mobileNavRef}
      />
    </header>
  );
}
