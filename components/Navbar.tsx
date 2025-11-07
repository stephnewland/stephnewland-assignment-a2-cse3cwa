"use client";

import Link from "next/link";
import styles from "./Header.module.css";

interface NavbarProps {
  navigationItems: { href: string; label: string }[];
  isMenuOpen: boolean;
  closeMenu: () => void;
  handleNavKeyDown: (e: React.KeyboardEvent, isDesktop?: boolean) => void;
  mobileNavRef: React.RefObject<HTMLElement | null>;
}

const Navbar: React.FC<NavbarProps> = ({
  navigationItems,
  isMenuOpen,
  closeMenu,
  handleNavKeyDown,
  mobileNavRef,
}) => {
  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={styles.nav}
        role="navigation"
        aria-label="Main navigation"
      >
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1`}
            onKeyDown={(e) => handleNavKeyDown(e, true)}
            tabIndex={0}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <nav
        ref={mobileNavRef}
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        {navigationItems.map((item) => (
          <Link
            key={`mobile-${item.href}`}
            href={item.href}
            className={`${styles.navLink} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1`}
            onClick={closeMenu}
            onKeyDown={(e) => handleNavKeyDown(e, false)}
            tabIndex={isMenuOpen ? 0 : -1}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
