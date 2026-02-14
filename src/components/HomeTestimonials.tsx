import * as React from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  initials: string;
  avatarBg: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "דודו בוזגלו",
    role: "מנהל פרויקטים",
    text: "עבדנו עם החברה על מספר פרויקטים מורכבים. המקצועיות והאמינות שהם מפגינים היא ברמה הגבוהה ביותר. ממליץ בחום!",
    initials: "דב",
    avatarBg: "bg-amber-500",
  },
  {
    id: 2,
    name: "שרה לוי",
    role: "יזמית נדל״ן",
    text: "תוצאות מעולות בשיפוץ חזית הבניין שלנו. הצוות היה מקצועי, עמד בלוחות הזמנים והתוצאה עלתה על הציפיות.",
    initials: "של",
    avatarBg: "bg-emerald-500",
  },
  {
    id: 3,
    name: "משה אברהם",
    role: "וועד בית, רמת גן",
    text: "פתרון מקצועי לבעיית הרטיבות שנמשכה שנים. עבודה יסודית ומקיפה עם אחריות מלאה. תודה רבה!",
    initials: "מא",
    avatarBg: "bg-blue-500",
  },
  {
    id: 4,
    name: "רחל גולדשטיין",
    role: "מנהלת נכסים",
    text: "שירות אדיב, מקצועי ואמין. ביצעו עבודות גובה מורכבות בבניין שלנו בצורה מושלמת ובטוחה.",
    initials: "רג",
    avatarBg: "bg-purple-500",
  },
];

const BACKGROUND_TEXT = "לקוחות ממליצים עלינו";

const HomeTestimonials = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportH = window.innerHeight;
      // How far we've scrolled into the section (0 at top, 1 at bottom)
      const scrolled = (viewportH - rect.top) / sectionHeight;
      const clamped = Math.max(0, Math.min(1, scrolled));
      const idx = Math.min(
        testimonials.length - 1,
        Math.floor(clamped * testimonials.length)
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      dir="rtl"
      className="relative overflow-hidden"
      style={{ height: `${(testimonials.length + 1) * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ background: "hsl(100 30% 72%)" }}
      >
        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <p
            className="text-[12vw] sm:text-[10vw] font-black leading-[0.95] text-center whitespace-pre-wrap break-words"
            style={{
              color: "hsl(140 30% 22%)",
              opacity: 0.35,
              fontFamily: "'Ploni', sans-serif",
              maxWidth: "100vw",
            }}
          >
            {BACKGROUND_TEXT}
          </p>
        </div>

        {/* Stacked cards */}
        <div className="relative w-[90vw] max-w-[520px] aspect-[3/4] sm:aspect-[4/5]">
          {testimonials.map((t, i) => {
            const diff = i - activeIndex;
            // Cards behind: slightly visible stacked
            const isActive = diff === 0;
            const isBehind = diff < 0;
            const isAhead = diff > 0;

            // Rotation & offset
            const rotate = isActive ? -6 : isBehind ? -6 - diff * 2 : -6 + diff * 3;
            const translateY = isActive ? 0 : isAhead ? diff * 12 : diff * 8;
            const scale = isActive ? 1 : isBehind ? 1 - Math.abs(diff) * 0.03 : 1 - diff * 0.05;
            const opacity = Math.abs(diff) > 2 ? 0 : isActive ? 1 : isBehind ? 0.6 - Math.abs(diff) * 0.2 : 1 - diff * 0.3;
            const zIndex = testimonials.length - Math.abs(diff) + (isActive ? 10 : 0);

            return (
              <div
                key={t.id}
                className="absolute inset-0 transition-all duration-700 ease-out"
                style={{
                  transform: `rotate(${rotate}deg) translateY(${translateY}px) scale(${scale})`,
                  opacity: Math.max(0, opacity),
                  zIndex,
                }}
              >
                <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm",
                            t.avatarBg
                          )}
                        >
                          {t.initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{t.name}</h4>
                          <p className="text-gray-500 text-sm">{t.role}</p>
                        </div>
                      </div>
                      {/* Star icon */}
                      <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#c9a84c]" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>

                    {/* Quote text */}
                    <p className="text-gray-800 text-lg sm:text-xl leading-relaxed font-medium">
                      {t.text}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-gray-400 text-sm">
                      א.א פרויקטים וגובה
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
