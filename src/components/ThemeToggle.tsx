import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger } from
"@/components/ui/tooltip";

const FIRST_TIME_KEY = "theme-toggle-seen";

// Safe translation hook that doesn't throw if context is missing
const useThemeTranslations = () => {
  // Default translations
  const defaults = {
    light: "מצב בהיר",
    dark: "מצב כהה",
    label: "עיצוב",
    tooltip: "החלף למצב {{mode}}",
    firstTimeTip: "לחץ כאן כדי להחליף בין מצב בהיר לכהה"
  };

  return defaults;
};

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const translations = useThemeTranslations();
  const [showFirstTimeTip, setShowFirstTimeTip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if this is the first time the user sees the toggle
    const hasSeenToggle = localStorage.getItem(FIRST_TIME_KEY);
    if (!hasSeenToggle) {
      // Show tip after a short delay
      const timer = setTimeout(() => {
        setShowFirstTimeTip(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    // Mark as seen and hide the tip
    localStorage.setItem(FIRST_TIME_KEY, "true");
    setShowFirstTimeTip(false);
  };

  const dismissTip = () => {
    localStorage.setItem(FIRST_TIME_KEY, "true");
    setShowFirstTimeTip(false);
  };

  if (!mounted) return null;

  const nextMode = theme === "dark" ? translations.light : translations.dark;
  const tooltipText = translations.tooltip.replace("{{mode}}", nextMode);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex items-center">
            {/* First-time tip bubble */}
            {showFirstTimeTip







            }
            
            {/* Button */}
            <button
              onClick={handleClick}
              className="relative h-10 w-10 rounded-full bg-black/90 dark:bg-black flex items-center justify-center border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg"
              aria-label={tooltipText}>

              <Sun className="h-5 w-5 text-white rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 text-white rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>);

};