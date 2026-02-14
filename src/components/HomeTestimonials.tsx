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
  { id: 1, name: "דודו בוזגלו", role: "מנהל פרויקטים", text: "עבדנו עם החברה על מספר פרויקטים מורכבים. המקצועיות והאמינות שהם מפגינים היא ברמה הגבוהה ביותר. ממליץ בחום!", initials: "דב", avatarBg: "bg-amber-500" },
  { id: 2, name: "שרה לוי", role: "יזמית נדל״ן", text: "תוצאות מעולות בשיפוץ חזית הבניין שלנו. הצוות היה מקצועי, עמד בלוחות הזמנים והתוצאה עלתה על הציפיות.", initials: "של", avatarBg: "bg-emerald-500" },
  { id: 3, name: "משה אברהם", role: "וועד בית, רמת גן", text: "פתרון מקצועי לבעיית הרטיבות שנמשכה שנים. עבודה יסודית ומקיפה עם אחריות מלאה. תודה רבה!", initials: "מא", avatarBg: "bg-blue-500" },
  { id: 4, name: "רחל גולדשטיין", role: "מנהלת נכסים", text: "שירות אדיב, מקצועי ואמין. ביצעו עבודות גובה מורכבות בבניין שלנו בצורה מושלמת ובטוחה.", initials: "רג", avatarBg: "bg-purple-500" },
  { id: 5, name: "יוסי כהן", role: "קבלן שיפוצים", text: "עבודה ברמה גבוהה מאוד, צוות מקצועי שמבין את העבודה לעומק. שיתוף פעולה מעולה מתחילת הפרויקט ועד סופו.", initials: "יכ", avatarBg: "bg-rose-500" },
  { id: 6, name: "מיכל דוד", role: "דיירת, תל אביב", text: "הגיעו בזמן, עבדו בצורה נקייה ומסודרת, והתוצאה הסופית פשוט מדהימה. הבניין נראה כמו חדש!", initials: "מד", avatarBg: "bg-teal-500" },
  { id: 7, name: "אבי ישראלי", role: "מהנדס בניין", text: "מקצוענים אמיתיים. טיפלו בבעיות איטום מורכבות עם פתרונות חכמים ויצירתיים. ממליץ לכל פרויקט גובה.", initials: "אי", avatarBg: "bg-indigo-500" },
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
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <p
            className="text-[14vw] sm:text-[11vw] font-black leading-[0.9] text-center whitespace-pre-wrap break-words"
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
                  <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm", t.avatarBg)}>
                            {t.initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">{t.name}</h4>
                            <p className="text-gray-500 text-sm">{t.role}</p>
                          </div>
                        </div>
                        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#c9a84c]" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-800 text-lg sm:text-xl leading-relaxed font-medium">{t.text}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-gray-400 text-sm">א.א פרויקטים וגובה</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
