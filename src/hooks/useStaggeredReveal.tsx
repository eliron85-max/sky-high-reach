import { useEffect, useRef, useState, useMemo } from "react";

interface UseStaggeredRevealOptions {
  index: number;
  baseDelay?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useStaggeredReveal = (options: UseStaggeredRevealOptions) => {
  const {
    index,
    baseDelay = 100,
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  const style = useMemo(() => ({
    transitionDelay: `${index * baseDelay}ms`,
  }), [index, baseDelay]);

  return { ref, isVisible, style };
};
