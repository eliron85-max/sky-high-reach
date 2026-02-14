import * as React from "react";
import { cn } from "@/lib/utils";

import avatar1 from "@/assets/avatar-1.webp";
import avatar2 from "@/assets/avatar-2.webp";
import avatar3 from "@/assets/avatar-3.webp";
import avatar4 from "@/assets/avatar-4.webp";
import avatar5 from "@/assets/avatar-5.webp";
import avatar6 from "@/assets/avatar-6.webp";
import avatar7 from "@/assets/avatar-7.webp";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  { id: 1, name: "דודו בוזגלו", role: "מנהל פרויקטים", text: "עבדנו עם החברה על מספר פרויקטים מורכבים. המקצועיות והאמינות שהם מפגינים היא ברמה הגבוהה ביותר. ממליץ בחום!", avatar: avatar1 },
  { id: 2, name: "שרה לוי", role: "יזמית נדל״ן", text: "תוצאות מעולות בשיפוץ חזית הבניין שלנו. הצוות היה מקצועי, עמד בלוחות הזמנים והתוצאה עלתה על הציפיות.", avatar: avatar2 },
  { id: 3, name: "משה אברהם", role: "וועד בית, רמת גן", text: "פתרון מקצועי לבעיית הרטיבות שנמשכה שנים. עבודה יסודית ומקיפה עם אחריות מלאה. תודה רבה!", avatar: avatar3 },
  { id: 4, name: "רחל גולדשטיין", role: "מנהלת נכסים", text: "שירות אדיב, מקצועי ואמין. ביצעו עבודות גובה מורכבות בבניין שלנו בצורה מושלמת ובטוחה.", avatar: avatar4 },
  { id: 5, name: "יוסי כהן", role: "קבלן שיפוצים", text: "עבודה ברמה גבוהה מאוד, צוות מקצועי שמבין את העבודה לעומק. שיתוף פעולה מעולה מתחילת הפרויקט ועד סופו.", avatar: avatar5 },
  { id: 6, name: "מיכל דוד", role: "דיירת, תל אביב", text: "הגיעו בזמן, עבדו בצורה נקייה ומסודרת, והתוצאה הסופית פשוט מדהימה. הבניין נראה כמו חדש!", avatar: avatar6 },
  { id: 7, name: "אבי ישראלי", role: "מהנדס בניין", text: "מקצוענים אמיתיים. טיפלו בבעיות איטום מורכבות עם פתרונות חכמים ויצירתיים. ממליץ לכל פרויקט גובה.", avatar: avatar7 },
];

const BACKGROUND_TEXT = "לקוחות ממליצים עלינו";
const CARD_HEIGHT = 380;
const SCROLL_PER_CARD = 350;

const HomeTestimonials = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      // progress: 0 when section top hits viewport bottom, 1 when section bottom leaves viewport top
      const raw = (viewportH - rect.top) / (sectionHeight + viewportH);
      setScrollProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Total scrollable height = enough for each card to animate in
  const totalScrollHeight = testimonials.length * SCROLL_PER_CARD + 600;

  // Which card index is the "current" based on scroll
  const cardProgress = scrollProgress * testimonials.length;

  return (
    <section
      id="testimonials"
      dir="rtl"
      ref={sectionRef}
      className="relative z-20"
      style={{ height: `${totalScrollHeight}px`, background: "hsl(100 30% 72%)", isolation: "isolate" }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center overflow-hidden">
        {/* Title text — pinned to top */}
        <h2
          className="text-[18vw] sm:text-[14vw] lg:text-[10vw] font-black text-center pointer-events-none select-none leading-none pt-0"
          style={{
            color: "hsl(140 30% 22%)",
            opacity: 0.3,
            fontFamily: "'Ploni', sans-serif",
          }}
        >
          {BACKGROUND_TEXT}
        </h2>

        {/* Spacer to push cards to center */}
        <div className="flex-1" />

        {/* Cards stack */}
        <div className="relative w-[85vw] max-w-[480px]" style={{ height: `${CARD_HEIGHT}px` }}>
          {testimonials.map((t, i) => {
            // How far this card has progressed: 0 = not yet, 1 = fully landed
            const cardEntry = Math.max(0, Math.min(1, cardProgress - i));

            // Cards that haven't entered yet stay below
            if (cardEntry <= 0) return null;

            // Stacking offset: each landed card shifts up slightly
            const stackOffset = i * -8;
            const stackRotate = -4 + i * 1.5;
            const stackTranslateX = i * -6;

            // Entry animation: slide up from bottom
            const entryY = (1 - cardEntry) * 300;
            const entryRotate = (1 - cardEntry) * 15;
            const entryScale = 0.85 + cardEntry * 0.15;
            const entryOpacity = Math.min(1, cardEntry * 2);

            const finalY = stackOffset + entryY;
            const finalRotate = stackRotate + entryRotate;
            const zIndex = 10 + i;

            return (
              <div
                key={t.id}
                className="absolute inset-0"
                style={{
                  transform: `translateY(${finalY}px) translateX(${stackTranslateX}px) rotate(${finalRotate}deg) scale(${entryScale})`,
                  opacity: entryOpacity,
                  zIndex,
                  willChange: "transform, opacity",
                }}
              >
                {/* Float breath */}
                <div
                  className="w-full h-full"
                  style={{
                    animation: cardEntry >= 1 ? `testimonialFloat 4s ease-in-out ${i * 0.6}s infinite` : "none",
                  }}
                >
                  <div className="w-full h-full rounded-lg shadow-lg p-0 flex flex-col justify-between relative" style={{ background: '#dcf8c6' }}>
                    {/* WhatsApp tail */}
                    <div className="absolute -top-2 right-4 w-4 h-4 rotate-45" style={{ background: '#dcf8c6' }} />
                    <div className="p-4 pb-2">
                      {/* Contact header */}
                      <div className="flex items-center gap-2 mb-2">
                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                        <span className="font-semibold text-[#075e54] text-sm">{t.name}</span>
                        <span className="text-[#667781] text-xs">· {t.role}</span>
                      </div>
                      {/* Message text */}
                      <p className="text-[#111b21] text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif" }}>{t.text}</p>
                    </div>
                    {/* Timestamp + double check */}
                    <div className="flex items-center justify-end gap-1 px-4 pb-3">
                      <span className="text-[#667781] text-[11px]">09:{String(30 + i).padStart(2, '0')}</span>
                      {/* Double check marks */}
                      <svg viewBox="0 0 16 11" width="16" height="11" className="text-[#53bdeb]">
                        <path fill="currentColor" d="M11.071.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178l-6.19 7.636-2.011-2.095a.463.463 0 0 0-.336-.153.457.457 0 0 0-.344.153.52.52 0 0 0 0 .72l2.382 2.477a.476.476 0 0 0 .68.01l6.588-8.136a.484.484 0 0 0-.084-.688ZM7.543.653a.457.457 0 0 0-.304-.102.493.493 0 0 0-.381.178L.668 8.365a.484.484 0 0 0 .084.688.457.457 0 0 0 .304.102.493.493 0 0 0 .381-.178l6.19-7.636a.484.484 0 0 0-.084-.688Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Spacer to center cards */}
        <div className="flex-1" />
      </div>

      <style>{`
        @keyframes testimonialFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default HomeTestimonials;
