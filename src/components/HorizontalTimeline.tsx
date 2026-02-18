import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const milestones = [
  {
    year: "2008",
    title: "ההתחלה",
    description: "הקמת החברה עם צוות קטן ומסור, התמחות ראשונית בעבודות סנפלינג",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  },
  {
    year: "2010",
    title: "הסמכות",
    description: "קבלת הסמכות מקצועיות לעבודות גובה ותקני בטיחות בינלאומיים",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80",
  },
  {
    year: "2013",
    title: "התרחבות",
    description: "הרחבת מגוון השירותים לאיטום, שיקום מבנים וצביעת חזיתות",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  },
  {
    year: "2015",
    title: "פרויקטים גדולים",
    description: "כניסה לפרויקטים מסחריים גדולים ושיתופי פעולה עם קבלנים מובילים",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80",
  },
  {
    year: "2018",
    title: "חדשנות",
    description: "אימוץ טכנולוגיות מתקדמות וחומרי איטום חדשניים מהעולם",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
  },
  {
    year: "2020",
    title: "צמיחה",
    description: "הגעה ליותר מ-500 לקוחות מרוצים ופרויקטים בכל רחבי הארץ",
    image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=400&q=80",
  },
  {
    year: "2022",
    title: "מצוינות",
    description: "קבלת תו איכות ארצי ושיתופי פעולה עם רשויות מקומיות",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
  },
  {
    year: "2024",
    title: "העתיד",
    description: "המשך צמיחה, הכשרת דור חדש של מקצוענים והרחבת פעילות",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
  },
];

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const CARD_W = 320;
const GAP = 36;
const SCROLL_VH = 9;

const HorizontalTimeline = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const maxTranslateRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const trackWidth = useMemo(() => {
    return milestones.length * CARD_W + (milestones.length - 1) * GAP;
  }, []);

  useEffect(() => {
    const computeMaxTranslate = () => {
      const vp = viewportRef.current;
      if (!vp) return;
      maxTranslateRef.current = Math.max(0, trackWidth - vp.clientWidth);
    };

    const apply = () => {
      rafRef.current = null;
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScroll = (window.innerHeight || 1) * SCROLL_VH;
      const scrolled = -rect.top;
      const p = clamp01(scrolled / (totalScroll || 1));

      // RTL: translateX חיובי כדי שהכרטיסים יזוזו שמאלה
      const tr = trackRef.current;
      if (tr) tr.style.transform = `translate3d(${p * maxTranslateRef.current}px, 0, 0)`;

      const ln = lineRef.current;
      if (ln) ln.style.width = `${p * 100}%`;

      const idx = Math.max(0, Math.min(milestones.length - 1, Math.floor(p * (milestones.length - 1) + 0.05)));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    computeMaxTranslate();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { computeMaxTranslate(); onScroll(); });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [trackWidth]);

  return (
    <section ref={sectionRef as any} className="relative bg-hero-dark" style={{ height: `${(SCROLL_VH + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="text-center mb-8 px-4">
          <span className="text-[#dfc798] text-sm tracking-[0.3em] uppercase">המסע שלנו</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-3">ציוני דרך</h2>
        </div>

        <div ref={viewportRef} className="overflow-hidden px-8 md:px-16">
          <div
            ref={trackRef}
            className="relative will-change-transform transform-gpu"
            style={{ width: `${trackWidth}px`, transform: "translate3d(0,0,0)" }}
          >
            <div className="relative mb-8">
              <div className="h-px bg-white/10 w-full" />
              <div ref={lineRef} className="absolute top-0 right-0 h-px bg-[#dfc798]" style={{ width: "0%" }} />

              {milestones.map((m, i) => {
                const isActive = i <= activeIndex;
                const markerX = i * (CARD_W + GAP) + CARD_W / 2;
                return (
                  <div
                    key={m.year}
                    className={`absolute -top-3 w-6 h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                      isActive ? "bg-[#dfc798] border-[#dfc798] scale-110" : "bg-hero-dark border-white/20"
                    }`}
                    style={{ right: `${markerX - 12}px` }}
                  >
                    <div className={`w-2 h-2 rounded-full ${isActive ? "bg-hero-dark" : "bg-white/20"}`} />
                  </div>
                );
              })}
            </div>

            <div className="flex" style={{ gap: `${GAP}px` }}>
              {milestones.map((m, i) => {
                const isActive = i <= activeIndex;
                return (
                  <motion.div
                    key={m.year}
                    className="flex-shrink-0 group"
                    style={{ width: `${CARD_W}px` }}
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <div className="rounded-2xl overflow-hidden border border-[#dfc798]/20 mb-5">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <span className="text-[#dfc798] text-3xl font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>{m.year}</span>
                    <h3 className="text-xl font-bold mt-2 mb-2 text-white">{m.title}</h3>
                    <p className="text-white/60 leading-relaxed text-sm">{m.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <motion.div
            className="inline-flex items-center gap-2 text-white/40 text-xs"
            animate={{ opacity: activeIndex >= milestones.length - 2 ? 0 : 0.6 }}
          >
            <span>גלול למטה</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalTimeline;
