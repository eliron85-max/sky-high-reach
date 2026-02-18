import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  first: ReactNode;
  second: ReactNode;
  third?: ReactNode;
  scrollScreens?: number;
  preScreens?: number;
  postScreens?: number;
  coverScreens?: number;
  coverRadiusPx?: number;
  coverPostScreens?: number;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function StickyRevealSection({
  first, second, third,
  scrollScreens = 2.5, preScreens = 0, postScreens = 0,
  coverScreens = 1.5, coverRadiusPx = 28, coverPostScreens = 0,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const firstLayerRef = useRef<HTMLDivElement | null>(null);
  const thirdLayerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastPRef = useRef<number>(-1);
  const lastCPRef = useRef<number>(-1);
  const hasThird = !!third;
  const totalCover = hasThird ? coverScreens : 0;

  useEffect(() => {
    const apply = () => {
      rafRef.current = null;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const preTotal = vh * preScreens;
      const peelTotal = vh * scrollScreens;
      const postTotal = vh * postScreens;
      const coverTotal = vh * totalCover;
      const scrolled = Math.max(0, -rect.top);
      const p = clamp01((scrolled - preTotal) / (peelTotal || 1));
      let cp = 0;
      if (hasThird) {
        const coverStart = preTotal + peelTotal + postTotal;
        cp = clamp01((scrolled - coverStart) / (coverTotal || 1));
      }
      if (Math.abs(p - lastPRef.current) < 0.001 && Math.abs(cp - lastCPRef.current) < 0.001) return;
      lastPRef.current = p; lastCPRef.current = cp;
      const firstLayer = firstLayerRef.current;
      if (firstLayer) {
        const firstY = -p * 110;
        const firstRotate = p * 2;
        const radius = p * 40;
        const shadowOpacity = p * 0.6;
        firstLayer.style.transform = `translate3d(0, ${firstY}%, 0) perspective(1200px) rotateX(${firstRotate}deg)`;
        firstLayer.style.borderBottomLeftRadius = `${radius}px`;
        firstLayer.style.borderBottomRightRadius = `${radius}px`;
        firstLayer.style.boxShadow = `0 ${30 * p}px ${60 * p}px rgba(0, 0, 0, ${shadowOpacity})`;
      }
      const thirdLayer = thirdLayerRef.current;
      if (thirdLayer) {
        const thirdY = (1 - cp) * 100;
        thirdLayer.style.transform = `translate3d(0, ${thirdY}%, 0)`;
      }
    };
    const onScroll = () => { if (rafRef.current != null) return; rafRef.current = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, [scrollScreens, preScreens, postScreens, totalCover, hasThird]);

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${(preScreens + scrollScreens + 1 + postScreens + totalCover + (hasThird ? coverPostScreens : 0)) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">{second}</div>
        <div ref={firstLayerRef} className="absolute inset-0 will-change-transform transform-gpu bg-background" style={{ opacity: 1, overflow: "hidden" }}>
          <div className="h-full w-full bg-background">{first}</div>
        </div>
        {hasThird && (
          <div ref={thirdLayerRef} className="absolute inset-0 will-change-transform transform-gpu" style={{ transform: "translate3d(0, 100%, 0)" }}>
            <div className="h-full w-full bg-background overflow-hidden contain-paint" style={{ borderTopLeftRadius: coverRadiusPx, borderTopRightRadius: coverRadiusPx }}>
              {third}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
