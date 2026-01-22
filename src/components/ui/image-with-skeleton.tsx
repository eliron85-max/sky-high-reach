import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
  responsiveSizes?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Disable WebP format (useful if source is already WebP) */
  disableWebP?: boolean;
}

/**
 * Generates srcSet for Unsplash images with different widths
 */
const generateUnsplashSrcSet = (
  baseUrl: string,
  sizes: { sm?: number; md?: number; lg?: number; xl?: number },
  format?: "webp" | "jpg"
): string | undefined => {
  if (!baseUrl.includes("unsplash.com")) return undefined;

  // Remove existing width and format parameters
  let cleanUrl = baseUrl.replace(/[?&]w=\d+/, "").replace(/[?&]fm=\w+/, "");
  const separator = cleanUrl.includes("?") ? "&" : "?";

  const widths = [
    sizes.sm || 640,
    sizes.md || 768,
    sizes.lg || 1024,
    sizes.xl || 1920,
  ];

  const formatParam = format ? `&fm=${format}` : "";

  return widths
    .map((w) => `${cleanUrl}${separator}w=${w}&q=80${formatParam} ${w}w`)
    .join(", ");
};

/**
 * Generates a single Unsplash URL with WebP format
 */
const generateUnsplashWebPUrl = (baseUrl: string): string | undefined => {
  if (!baseUrl.includes("unsplash.com")) return undefined;

  let cleanUrl = baseUrl.replace(/[?&]fm=\w+/, "");
  const separator = cleanUrl.includes("?") ? "&" : "?";
  return `${cleanUrl}${separator}fm=webp`;
};

/**
 * Generates sizes attribute for responsive images
 */
const generateSizesAttr = (): string => {
  return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";
};

/**
 * Checks if a URL/path is a WebP image
 */
const isWebPImage = (src: string): boolean => {
  return src.toLowerCase().includes(".webp");
};

const ImageWithSkeleton = ({
  className,
  skeletonClassName,
  alt,
  src,
  srcSet,
  sizes,
  responsiveSizes,
  disableWebP = false,
  ...props
}: ImageWithSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const isUnsplash = src?.includes("unsplash.com") ?? false;
  const sourceIsWebP = src ? isWebPImage(src) : false;
  
  // Disable WebP conversion if source is already WebP or explicitly disabled
  const shouldUseWebP = !disableWebP && !sourceIsWebP && isUnsplash;

  // Generate srcSets for WebP and fallback
  const webPSrcSet = shouldUseWebP && responsiveSizes && src
    ? generateUnsplashSrcSet(src, responsiveSizes, "webp")
    : undefined;

  const fallbackSrcSet =
    srcSet ||
    (responsiveSizes && src
      ? generateUnsplashSrcSet(src, responsiveSizes, shouldUseWebP ? "jpg" : undefined)
      : undefined);

  // Single WebP URL for non-responsive images
  const webPSrc = shouldUseWebP && src && !responsiveSizes
    ? generateUnsplashWebPUrl(src)
    : undefined;

  const computedSizes = sizes || (fallbackSrcSet ? generateSizesAttr() : undefined);

  const imageClasses = cn(
    "transition-opacity duration-500 ease-out",
    isLoaded ? "opacity-100" : "opacity-0",
    className
  );

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <Skeleton
          className={cn(
            "absolute inset-0 w-full h-full",
            skeletonClassName
          )}
        />
      )}
      <picture>
        {/* WebP source for modern browsers */}
        {webPSrcSet && (
          <source
            type="image/webp"
            srcSet={webPSrcSet}
            sizes={computedSizes}
          />
        )}
        {webPSrc && !webPSrcSet && (
          <source
            type="image/webp"
            srcSet={webPSrc}
          />
        )}
        {/* Fallback for older browsers */}
        <img
          {...props}
          src={src}
          srcSet={fallbackSrcSet}
          sizes={computedSizes}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={imageClasses}
        />
      </picture>
    </div>
  );
};

export { ImageWithSkeleton, generateUnsplashSrcSet };
