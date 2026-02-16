import { Accessibility } from "lucide-react";
import React, { Suspense, useState, useCallback } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { ScrollToTopButton } from "./ScrollToTopButton";

// Lazy load the full widget modal
const AccessibilityWidgetModal = React.lazy(() => import("./AccessibilityWidgetModal"));

const AccessibilityButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Theme toggle + Accessibility button + ScrollToTop stack */}
      <div className="fixed bottom-6 left-4 z-40 flex flex-col items-center gap-3">
        <ThemeToggle />
        <button
          onClick={handleOpen}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
          aria-label="פתח הגדרות נגישות"
          title="נגישות"
        >
          <Accessibility className="h-6 w-6" />
        </button>
        <ScrollToTopButton inline />
      </div>

      {/* Lazy loaded modal */}
      {isOpen && (
        <Suspense fallback={null}>
          <AccessibilityWidgetModal isOpen={isOpen} onClose={handleClose} />
        </Suspense>
      )}
    </>
  );
};

export default AccessibilityButton;
