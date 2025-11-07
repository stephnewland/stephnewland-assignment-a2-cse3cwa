import { useEffect, useRef } from "react";

interface KeyboardNavigationOptions {
  selector?: string; // CSS selector for focusable elements
  wrapAround?: boolean; // Whether to wrap around when reaching end/beginning
  onEscape?: () => void; // Callback for escape key
  onEnter?: (element: Element, index: number) => void; // Callback for enter key
  onSpace?: (element: Element, index: number) => void; // Callback for space key
  enableArrowKeys?: boolean; // Enable arrow key navigation
  enableHomeEnd?: boolean; // Enable Home/End key navigation
}

export function useKeyboardNavigation<T extends HTMLElement>(
  options: KeyboardNavigationOptions = {}
) {
  const containerRef = useRef<T>(null);

  const {
    selector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    wrapAround = true,
    onEscape,
    onEnter,
    onSpace,
    enableArrowKeys = true,
    enableHomeEnd = true,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!container.contains(e.target as Node)) return;

      const focusableElements = container.querySelectorAll(
        selector
      ) as NodeListOf<HTMLElement>;
      const elementsArray = Array.from(focusableElements);
      const currentIndex = elementsArray.findIndex(
        (element) => element === e.target
      );

      if (currentIndex === -1) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          if (enableArrowKeys) {
            e.preventDefault();
            let nextIndex = currentIndex + 1;
            if (nextIndex >= elementsArray.length) {
              nextIndex = wrapAround ? 0 : elementsArray.length - 1;
            }
            elementsArray[nextIndex]?.focus();
          }
          break;

        case "ArrowUp":
        case "ArrowLeft":
          if (enableArrowKeys) {
            e.preventDefault();
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
              prevIndex = wrapAround ? elementsArray.length - 1 : 0;
            }
            elementsArray[prevIndex]?.focus();
          }
          break;

        case "Home":
          if (enableHomeEnd) {
            e.preventDefault();
            elementsArray[0]?.focus();
          }
          break;

        case "End":
          if (enableHomeEnd) {
            e.preventDefault();
            elementsArray[elementsArray.length - 1]?.focus();
          }
          break;

        case "Escape":
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;

        case "Enter":
          if (onEnter) {
            e.preventDefault();
            onEnter(e.target as Element, currentIndex);
          }
          break;

        case " ":
          if (onSpace) {
            e.preventDefault();
            onSpace(e.target as Element, currentIndex);
          }
          break;
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [
    selector,
    wrapAround,
    onEscape,
    onEnter,
    onSpace,
    enableArrowKeys,
    enableHomeEnd,
  ]);

  // Helper function to focus first element
  const focusFirst = () => {
    const container = containerRef.current;
    if (!container) return;

    const firstElement = container.querySelector(selector) as HTMLElement;
    firstElement?.focus();
  };

  // Helper function to focus last element
  const focusLast = () => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(
      selector
    ) as NodeListOf<HTMLElement>;
    const lastElement = elements[elements.length - 1];
    lastElement?.focus();
  };

  return {
    containerRef,
    focusFirst,
    focusLast,
  };
}
