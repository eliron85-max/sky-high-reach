import { useState, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  grayscale: boolean;
  linkHighlight: boolean;
  bigCursor: boolean;
  pauseAnimations: boolean;
  dyslexicFont: boolean;
  textSpacing: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  linkHighlight: false,
  bigCursor: false,
  pauseAnimations: false,
  dyslexicFont: false,
  textSpacing: false,
};

interface AccessibilityWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityWidgetModal = ({ isOpen, onClose }: AccessibilityWidgetModalProps) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem("accessibility-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const applySettings = useCallback((newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    const body = document.body;

    // Font size
    root.style.fontSize = `${newSettings.fontSize}%`;

    // High contrast
    if (newSettings.highContrast) {
      body.classList.add("high-contrast");
    } else {
      body.classList.remove("high-contrast");
    }

    // Grayscale
    if (newSettings.grayscale) {
      body.classList.add("grayscale-mode");
    } else {
      body.classList.remove("grayscale-mode");
    }

    // Link highlight
    if (newSettings.linkHighlight) {
      body.classList.add("link-highlight");
    } else {
      body.classList.remove("link-highlight");
    }

    // Big cursor
    if (newSettings.bigCursor) {
      body.classList.add("big-cursor");
    } else {
      body.classList.remove("big-cursor");
    }

    // Pause animations
    if (newSettings.pauseAnimations) {
      body.classList.add("pause-animations");
    } else {
      body.classList.remove("pause-animations");
    }

    // Dyslexic font
    if (newSettings.dyslexicFont) {
      body.classList.add("dyslexic-font");
    } else {
      body.classList.remove("dyslexic-font");
    }

    // Text spacing
    if (newSettings.textSpacing) {
      body.classList.add("text-spacing");
    } else {
      body.classList.remove("text-spacing");
    }

    // Save to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(newSettings));
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 150) {
      updateSetting("fontSize", settings.fontSize + 10);
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 80) {
      updateSetting("fontSize", settings.fontSize - 10);
    }
  };

  // Apply settings on mount
  useEffect(() => {
    applySettings(settings);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
      >
        {/* Header */}
        <div className="bg-gold/10 border-b border-gold/20 p-4 flex items-center justify-between">
          <h2 id="accessibility-title" className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-gold">♿</span>
            הגדרות נגישות
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background/50 rounded-full transition-colors"
            aria-label="סגור הגדרות נגישות"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Font Size */}
          <div className="bg-muted/30 rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-foreground">גודל טקסט</h3>
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={decreaseFontSize}
                disabled={settings.fontSize <= 80}
                className="p-3 bg-background hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="הקטן טקסט"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <div className="flex-1 text-center">
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-300"
                    style={{ width: `${((settings.fontSize - 80) / 70) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground mt-1 block">
                  {settings.fontSize}%
                </span>
              </div>
              <button
                onClick={increaseFontSize}
                disabled={settings.fontSize >= 150}
                className="p-3 bg-background hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="הגדל טקסט"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "highContrast" as const, label: "ניגודיות גבוהה", icon: "🔲" },
              { key: "grayscale" as const, label: "גווני אפור", icon: "⚫" },
              { key: "linkHighlight" as const, label: "הדגשת קישורים", icon: "🔗" },
              { key: "bigCursor" as const, label: "סמן גדול", icon: "👆" },
              { key: "pauseAnimations" as const, label: "עצירת אנימציות", icon: "⏸️" },
              { key: "dyslexicFont" as const, label: "פונט לדיסלקטים", icon: "📖" },
              { key: "textSpacing" as const, label: "ריווח טקסט", icon: "↔️" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => updateSetting(option.key, !settings[option.key])}
                className={`p-3 rounded-xl text-right transition-all duration-200 flex items-center gap-2 ${
                  settings[option.key]
                    ? "bg-gold text-black ring-2 ring-gold"
                    : "bg-muted/30 hover:bg-muted/50 text-foreground"
                }`}
                aria-pressed={settings[option.key]}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Reset Button */}
          <button
            onClick={resetSettings}
            className="w-full p-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            איפוס הגדרות
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 bg-muted/20">
          <Link
            to="/accessibility"
            className="text-sm text-gold hover:underline flex items-center justify-center gap-1"
            onClick={onClose}
          >
            <ExternalLink className="h-3 w-3" />
            הצהרת נגישות
          </Link>
        </div>
      </div>
    </>
  );
};

export default AccessibilityWidgetModal;
