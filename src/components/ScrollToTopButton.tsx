import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ScrollToTopButtonProps {
  inline?: boolean;
}

export const ScrollToTopButton = ({ inline = false }: ScrollToTopButtonProps) => {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setIsVisible(scrollTop > 200);

      const isNearBottom = scrollTop + windowHeight >= docHeight - 100;
      setIsAtBottom(isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (!isVisible) return null;

  const baseClasses = "w-12 h-12 rounded-full bg-transparent border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 flex items-center justify-center shadow-lg transition";

  if (inline) {
    return (
      <button
        onClick={handleClick}
        className={baseClasses}
        aria-label={isAtBottom ? "גלול למעלה" : "גלול למטה"}
      >
        {isAtBottom ? <ChevronUp size={24} strokeWidth={2.5} /> : <ChevronDown size={24} strokeWidth={2.5} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 left-4 z-50 ${baseClasses}`}
      aria-label={isAtBottom ? "גלול למעלה" : "גלול למטה"}
    >
      {isAtBottom ? <ChevronUp size={24} strokeWidth={2.5} /> : <ChevronDown size={24} strokeWidth={2.5} />}
    </button>
  );
};
