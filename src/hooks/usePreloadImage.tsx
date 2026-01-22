import { useEffect } from "react";

/**
 * Preloads an image by creating a link[rel="preload"] element
 * Useful for LCP optimization on critical above-the-fold images
 */
export const usePreloadImage = (src: string | undefined, options?: {
  as?: "image";
  type?: string;
  fetchpriority?: "high" | "low" | "auto";
}) => {
  useEffect(() => {
    if (!src) return;

    // Check if already preloaded
    const existingLink = document.querySelector(`link[rel="preload"][href="${src}"]`);
    if (existingLink) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = options?.as || "image";
    link.href = src;
    
    if (options?.type) {
      link.type = options.type;
    }
    
    if (options?.fetchpriority) {
      link.setAttribute("fetchpriority", options.fetchpriority);
    }

    document.head.appendChild(link);

    return () => {
      // Don't remove - keep cached for navigation
    };
  }, [src, options?.as, options?.type, options?.fetchpriority]);
};

/**
 * Preloads multiple images
 */
export const usePreloadImages = (srcs: string[]) => {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    srcs.forEach((src) => {
      if (!src) return;
      
      // Check if already preloaded
      const existingLink = document.querySelector(`link[rel="preload"][href="${src}"]`);
      if (existingLink) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      // Don't remove - keep cached
    };
  }, [srcs.join(",")]);
};

/**
 * Generates optimized Unsplash URL for preloading
 */
export const getOptimizedUnsplashUrl = (
  baseUrl: string, 
  width: number = 1920,
  format: "webp" | "jpg" = "webp"
): string => {
  if (!baseUrl.includes("unsplash.com")) return baseUrl;
  
  let cleanUrl = baseUrl.replace(/[?&]w=\d+/, "").replace(/[?&]fm=\w+/, "");
  const separator = cleanUrl.includes("?") ? "&" : "?";
  return `${cleanUrl}${separator}w=${width}&fm=${format}&q=80`;
};
