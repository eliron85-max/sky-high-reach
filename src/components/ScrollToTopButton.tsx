import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

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

  const label = isAtBottom ? "גלול למעלה" : "גלול למטה";
  const Icon = isAtBottom ? ArrowUp : ArrowDown;

  const content = (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-1 bg-transparent border-none text-[#c9a84c] hover:text-[#c9a84c]/80 transition cursor-pointer group"
      aria-label={label}
    >
      <span className="text-xs font-medium tracking-wide select-none">{label} {isAtBottom ? "↑" : "↓"}</span>
      <Icon
        size={20}
        strokeWidth={2}
        className="animate-[bounceArrow_1.5s_ease-in-out_infinite]"
      />
      <style>{`
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </button>
  );

  if (inline) return content;

  return (
    <div className="fixed bottom-6 left-4 z-50">
      {content}
    </div>
  );
};
