import { useEffect, useState } from "react";

/**
 * Hook to detect mobile status bar / safe area height
 * Works on Android Chrome where env(safe-area-inset-top) returns 0
 */
export function useSafeAreaTop(): number {
  const [safeAreaTop, setSafeAreaTop] = useState(0);

  useEffect(() => {
    const detectSafeArea = () => {
      // Method 1: Try CSS env() via computed style
      const testEl = document.createElement("div");
      testEl.style.cssText = "position:fixed;top:env(safe-area-inset-top,0px);visibility:hidden;pointer-events:none;";
      document.body.appendChild(testEl);
      const envValue = parseFloat(getComputedStyle(testEl).top) || 0;
      document.body.removeChild(testEl);

      if (envValue > 0) {
        setSafeAreaTop(envValue);
        return;
      }

      // Method 2: Use visualViewport offset (works on some Android devices)
      if (window.visualViewport) {
        const offset = window.visualViewport.offsetTop;
        if (offset > 0) {
          setSafeAreaTop(offset);
          return;
        }
      }

      // Method 3: Detect Android and apply fixed offset
      const isAndroid = /android/i.test(navigator.userAgent);
      const isChrome = /chrome/i.test(navigator.userAgent);

      if (isAndroid && isChrome) {
        // Android Chrome status bar is typically 24-28dp
        // Using device pixel ratio to calculate actual pixels
        const dpr = window.devicePixelRatio || 1;
        // Android status bar is ~24dp, translates to ~24 * 1 CSS pixels on most devices
        // We use a conservative 28px to ensure no clipping
        setSafeAreaTop(28);
        return;
      }

      // Fallback: no safe area needed
      setSafeAreaTop(0);
    };

    detectSafeArea();

    // Re-detect on orientation change or resize
    window.addEventListener("resize", detectSafeArea);
    window.visualViewport?.addEventListener("resize", detectSafeArea);

    return () => {
      window.removeEventListener("resize", detectSafeArea);
      window.visualViewport?.removeEventListener("resize", detectSafeArea);
    };
  }, []);

  return safeAreaTop;
}

/**
 * Hook that sets a CSS variable for safe area top padding
 * Use with: var(--dynamic-safe-area-top)
 */
export function useSafeAreaCSSVariable(): void {
  const safeAreaTop = useSafeAreaTop();

  useEffect(() => {
    // Set CSS variable on document root
    document.documentElement.style.setProperty(
      "--dynamic-safe-area-top",
      `${safeAreaTop}px`
    );

    // Also set a combined header padding (safe area + base padding)
    const basePadding = 16; // Base padding we always want
    const totalPadding = Math.max(safeAreaTop + basePadding, 44); // Minimum 44px
    document.documentElement.style.setProperty(
      "--header-dynamic-padding",
      `${totalPadding}px`
    );
  }, [safeAreaTop]);
}
